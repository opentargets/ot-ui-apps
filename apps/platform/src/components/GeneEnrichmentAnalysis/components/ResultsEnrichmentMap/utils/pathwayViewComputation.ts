import type { ElementDefinition } from "cytoscape";
import type { GseaResult } from "../../../api/gseaApi";
import { getGeneList, overlapSimilarity } from "./index";
import type { ComputedStats } from "./types";
import { yieldToBrowser } from "./browser";

/**
 * Computes pathway view elements (nodes and edges)
 * Routes to async or sync computation based on data type and size
 */
export async function computePathwayViewElements(
  results: Array<GseaResult>,
  nodes: ElementDefinition[],
  similarityThreshold: number
): Promise<{
  elements: cytoscape.ElementDefinition[];
  stats: ComputedStats;
}> {



  const fdrThreshold =  1.0
  const pValueThreshold = 1.0
  const significantResults = results.filter((r) => (r.FDR as number) < fdrThreshold || (r["p-value"] as number) < pValueThreshold);
  const displayResults =
    significantResults.length > 0 ? significantResults : results.slice(0, 50);


  const geneToPathways = new Map<string, string[]>();

  for (const r of displayResults) {
    const geneList_ = getGeneList(r as unknown as GseaResult);
    for (const gene of geneList_) {
      if (!geneToPathways.has(gene)) {
        geneToPathways.set(gene, []);
      }
      const pathways = geneToPathways.get(gene);
      if (pathways) {
        pathways.push(r.Pathway as string);
      }
    }
  }

  const pathwayGenes = new Map<string, string[]>();
  for (const r of displayResults) {
    pathwayGenes.set(
      (r.ID as string) || (r.Pathway as string),
      getGeneList(r as unknown as GseaResult)
    );
  }

  // Create maps for pathway ID -> name and link lookup
  const pathwayNameMap = new Map<string, string>();
  const pathwayLinkMap = new Map<string, string | undefined>();
  for (const r of displayResults) {
    const id = (r.ID as string) || (r.Pathway as string);
    pathwayNameMap.set(id, r.Pathway as string);
    pathwayLinkMap.set(id, r.Link as string | undefined);
  }

  const pathwayIds = Array.from(pathwayGenes.keys());

  console.log(`[ENRICHMENT_MAP] Computing graph with ${pathwayIds.length} filtered terms`);

  // For larger datasets, use async chunked processing to allow UI responsiveness
  if (nodes.length > 1200) {
    //filter results to only include those with FDR < 0.5
   
    console.log(`[ENRICHMENT_MAP] Computing edges for ${pathwayIds.length} terms asynchronously...`);
    return  computePathwayEdgesAsync(
      pathwayIds,
      pathwayGenes,
      pathwayNameMap,
      pathwayLinkMap,
      nodes,
      similarityThreshold,
      significantResults.length > 0 ? significantResults : results.slice(0, 50)
    );
  }

  // For smaller datasets, use synchronous computation
  return computePathwayEdgesSync(
    pathwayIds,
    pathwayGenes,
    pathwayNameMap,
    pathwayLinkMap,
    nodes,
    similarityThreshold,
    significantResults.length > 0 ? significantResults : results.slice(0, 50)
  );
}

/**
 * Async computation for filtered GO datasets
 * Limits to top 300 most significant pathways and computes edges
 */
async function computePathwayEdgesAsync(
  pathwayIds: string[],
  pathwayGenes: Map<string, string[]>,
  pathwayNameMap: Map<string, string>,
  pathwayLinkMap: Map<string, string | undefined>,
  nodes: ElementDefinition[],
  similarityThreshold: number,
  results: Array<GseaResult>
) {
  // Sort pathways by FDR significance and limit to top 300
  const sortedPathwayIds = pathwayIds
    .map((id) => {
      const result = results.find((r) => (r.ID as string) === id || (r.Pathway as string) === id);
      return { id, fdr: result?.FDR as number || 1 };
    })
    .sort((a, b) => a.fdr - b.fdr)
    .slice(0, 100)
    .map((item) => item.id);
  
  const edges: ElementDefinition[] = [];
  const edgeSet = new Set<string>();
  let edgeCount = 0;

  for (let i = 0; i < sortedPathwayIds.length; i++) {
    for (let j = i + 1; j < sortedPathwayIds.length; j++) {
      const idA = sortedPathwayIds[i];
      const idB = sortedPathwayIds[j];
      const genesA = pathwayGenes.get(idA) || [];
      const genesB = pathwayGenes.get(idB) || [];

      if (genesA.length === 0 || genesB.length === 0) continue;

      const similarity = overlapSimilarity(genesA, genesB)

      const minThreshold = 0.01;
      const threshold = Math.max(minThreshold, similarityThreshold / 10);

      if (similarity >= threshold) {
        const edgeId = `${idA}-${idB}`;
        if (!edgeSet.has(edgeId)) {
          edgeSet.add(edgeId);

          const setA = new Set(genesA);
          const sharedGenes = genesB.filter((g) => setA.has(g));

          edges.push({
            data: {
              id: edgeId,
              source: idA,
              target: idB,
              sourceName: pathwayNameMap.get(idA),
              targetName: pathwayNameMap.get(idB),
              sourceLink: pathwayLinkMap.get(idA),
              targetLink: pathwayLinkMap.get(idB),
              sharedGenes,
              sharedCount: sharedGenes.length,
              similarityIndex: similarity,
              edgeWidth: Math.max(1.5, similarity * 5),
              edgeOpacity: Math.min(1, Math.max(0.5, similarity * 1.5)),
            },
          });
          edgeCount++;
        }
      }
    }
  }

  console.log(`[ENRICHMENT_MAP] Computed edges for top 300 significant pathways: ${sortedPathwayIds.length} pathways, ${edgeCount} edges`)
  return {
    elements: [...nodes, ...edges],
    stats: {
      totalPathways: results.length,
      displayedPathways: nodes.length,
      edges: edgeCount,
      totalGenes: new Map<string, string[]>().size,
      significantCount: results.filter((r) => (r.FDR as number) < 0.05).length,
    },
  };
}

/**
 * Synchronous computation for smaller datasets
 */
function computePathwayEdgesSync(
  pathwayIds: string[],
  pathwayGenes: Map<string, string[]>,
  pathwayNameMap: Map<string, string>,
  pathwayLinkMap: Map<string, string | undefined>,
  nodes: ElementDefinition[],
  similarityThreshold: number,
  results: Array<GseaResult>
) {
  const edges: ElementDefinition[] = [];
  const edgeSet = new Set<string>();
  let edgeCount = 0;

  for (let i = 0; i < pathwayIds.length; i++) {
    for (let j = i + 1; j < pathwayIds.length; j++) {
      const idA = pathwayIds[i];
      const idB = pathwayIds[j];
      const genesA = pathwayGenes.get(idA) || [];
      const genesB = pathwayGenes.get(idB) || [];

      if (genesA.length === 0 || genesB.length === 0) continue;

      const similarity = overlapSimilarity(genesA, genesB)

      const minThreshold = 0.01;
      const threshold = Math.max(minThreshold, similarityThreshold);

      if (similarity >= threshold) {
        const edgeId = `${idA}-${idB}`;
        if (!edgeSet.has(edgeId)) {
          edgeSet.add(edgeId);

          const setA = new Set(genesA);
          const sharedGenes = genesB.filter((g) => setA.has(g));

          edges.push({
            data: {
              id: edgeId,
              source: idA,
              target: idB,
              sourceName: pathwayNameMap.get(idA),
              targetName: pathwayNameMap.get(idB),
              sourceLink: pathwayLinkMap.get(idA),
              targetLink: pathwayLinkMap.get(idB),
              sharedGenes,
              sharedCount: sharedGenes.length,
              similarityIndex: similarity,
              edgeWidth: Math.max(1.5, similarity * 5),
              edgeOpacity: Math.min(1, Math.max(0.5, similarity * 1.5)),
            },
          });
          edgeCount++;
        }
      }
    }
  }
  console.log(similarityThreshold, 'computed nodes and results synchronously')
  return {
    elements: [...nodes, ...edges],
    stats: {
      totalPathways: results.length,
      displayedPathways: nodes.length,
      edges: edgeCount,
      totalGenes: new Map<string, string[]>().size,
      significantCount: results.filter((r) => (r.FDR as number) < 0.05).length,
    },
  };
}
