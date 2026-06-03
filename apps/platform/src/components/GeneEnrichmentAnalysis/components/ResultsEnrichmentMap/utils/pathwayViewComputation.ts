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
  // Build temporary pathway genes from all results to detect data type
  const tempPathwayGenes = new Map<string, string[]>();
  for (const r of results) {
    tempPathwayGenes.set(
      (r.ID as string) || (r.Pathway as string),
      getGeneList(r as unknown as GseaResult)
    );
  }




  const fdrThreshold =  0.1
  const significantResults = results.filter((r) => (r.FDR as number) < fdrThreshold);
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
    console.log(`[ENRICHMENT_MAP] Computing edges for ${pathwayIds.length} terms asynchronously...`);
    return await computePathwayEdgesAsync(
      pathwayIds,
      pathwayGenes,
      pathwayNameMap,
      pathwayLinkMap,
      nodes,
      similarityThreshold,
      results
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
    results
  );
}

/**
 * Async computation for filtered GO datasets
 * Processes all edges but yields to browser every CHUNK_SIZE iterations
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
  const edges: ElementDefinition[] = [];
  const edgeSet = new Set<string>();
  let edgeCount = 0;
  const CHUNK_SIZE = 20; // Yield to browser every 20 comparisons
  let comparisonCount = 0;

  for (let i = 0; i < pathwayIds.length; i++) {
    for (let j = i + 1; j < pathwayIds.length; j++) {
      // Yield to browser every CHUNK_SIZE comparisons
      if (comparisonCount > 0 && comparisonCount % CHUNK_SIZE === 0) {
        await yieldToBrowser();
      }
      comparisonCount++;

      const idA = pathwayIds[i];
      const idB = pathwayIds[j];
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

console.log(nodes.length, results.length, 'computed nodes and results async')
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
  console.log(nodes.length, results.length, 'computed nodes and results synchronously')
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
