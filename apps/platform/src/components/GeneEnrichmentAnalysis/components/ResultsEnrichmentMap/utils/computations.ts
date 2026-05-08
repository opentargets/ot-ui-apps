import type { ElementDefinition } from "cytoscape";
import type { GseaResult } from "../../../api/gseaApi";
import { getGeneList, jaccardSimilarity, overlapSimilarity } from "./index";
import type { ComputedStats } from "./types";

/**
 * Yield to the browser using requestIdleCallback (if available) or requestAnimationFrame
 * This allows the browser to handle UI events, repaints, and other tasks
 */
async function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback !== "undefined") {
      // requestIdleCallback - yields until browser is idle, best for background work
      requestIdleCallback(() => resolve());
    } else {
      // Fallback to requestAnimationFrame - yields after next frame paint
      requestAnimationFrame(() => resolve());
    }
  });
}




/**
 * Computes pathway view elements (nodes and edges)
 * Made async to support chunked processing of large GO datasets
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

  const tempPathwayIds = Array.from(tempPathwayGenes.keys());

  // Detect if this is GO data by checking if any pathway ID follows GO format (GO:0000000)
  const isGoData = tempPathwayIds.some((id) => /^GO:\d+$/.test(id));

  // Apply stricter FDR threshold for GO data to reduce computational load
  const fdrThreshold = isGoData ? 0.001 : 0.5;
  const significantResults = results.filter((r) => (r.FDR as number) < fdrThreshold);
  const displayResults =
    significantResults.length > 0 ? significantResults : results.slice(0, 50);

  console.log(
    `[ENRICHMENT_MAP] Detected ${isGoData ? "GO (Gene Ontology)" : "Pathway"} data - ` +
    `${results.length} total terms, ${displayResults.length} significant (FDR < ${fdrThreshold})`
  );

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
  const edgeSet = new Set<string>();

  console.log(`[ENRICHMENT_MAP] Computing graph with ${pathwayIds.length} filtered terms`);

  // For GO data, use async chunked processing to allow UI responsiveness
  // After FDR filtering, this should be manageable in size
  if (isGoData && pathwayIds.length > 50) {
    console.log(`[ENRICHMENT_MAP] Computing edges for ${pathwayIds.length} GO terms asynchronously...`);
    // Use the async version
    return await computePathwayEdgesAsync(
      pathwayIds,
      pathwayGenes,
      pathwayNameMap,
      pathwayLinkMap,
      isGoData,
      nodes,
      similarityThreshold,
      results
    );
  }

  // For smaller datasets or non-GO data, use synchronous computation
  const edgeResult = computePathwayEdgesSync(
    pathwayIds,
    pathwayGenes,
    pathwayNameMap,
    pathwayLinkMap,
    isGoData,
    nodes,
    similarityThreshold,
    results
  );

  return edgeResult;
}

/**
 * Async computation for filtered GO datasets
 * Processes all edges but yields to main thread every CHUNK_SIZE iterations
 */
async function computePathwayEdgesAsync(
  pathwayIds: string[],
  pathwayGenes: Map<string, string[]>,
  pathwayNameMap: Map<string, string>,
  pathwayLinkMap: Map<string, string | undefined>,
  isGoData: boolean,
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

      const similarity = isGoData
        ? overlapSimilarity(genesA, genesB)
        : jaccardSimilarity(genesA, genesB);

      const minGoThreshold = 0.01;
      const minPathwayThreshold = 0.05;
      const minThreshold = isGoData ? minGoThreshold : minPathwayThreshold;
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
              jaccardCoefficient: similarity,
              edgeWidth: Math.max(1.5, similarity * 5),
              edgeOpacity: Math.min(1, Math.max(0.5, similarity * 1.5)),
            },
          });
          edgeCount++;
        }
      }
    }
  }

  console.log(`[ENRICHMENT_MAP] Completed async edge computation: ${edgeCount} edges from ${pathwayIds.length} terms (${comparisonCount} comparisons)`);

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
  isGoData: boolean,
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

      const similarity = isGoData
        ? overlapSimilarity(genesA, genesB)
        : jaccardSimilarity(genesA, genesB);

      const minGoThreshold = 0.01;
      const minPathwayThreshold = 0.05;
      const minThreshold = isGoData ? minGoThreshold : minPathwayThreshold;
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
              jaccardCoefficient: similarity,
              edgeWidth: Math.max(1.5, similarity * 5),
              edgeOpacity: Math.min(1, Math.max(0.5, similarity * 1.5)),
            },
          });
          edgeCount++;
        }
      }
    }
  }

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
