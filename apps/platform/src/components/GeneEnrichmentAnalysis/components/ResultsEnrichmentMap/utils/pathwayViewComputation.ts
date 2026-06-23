import type { ElementDefinition } from "cytoscape";
import type { GseaResult } from "../../../api/gseaApi";
import { getGeneList, overlapSimilarity } from "./index";
import type { ComputedStats } from "./types";

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





  console.log(`[ENRICHMENT_MAP] 🚀 Started with ${results.length} results, ${nodes.length} nodes`);
  
  const fdrThreshold =  1.0;
  const pValueThreshold = 1.0;

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

  // For larger pathway datasets (>300 terms), use web worker to avoid blocking the main thread
  // With N pathways, we compute ~N*(N-1)/2 pairwise comparisons
  // 300 pathways = 45k comparisons (fast on main thread)
  // 6554 pathways = 21.5M comparisons (MUST use worker to avoid freeze)
  const largeDatasetThreshold = 300;
  
  if (pathwayIds.length > largeDatasetThreshold) {
    return computePathwayEdgesWithWorker(
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

async function computePathwayEdgesWithWorker(
  pathwayIds: string[],
  pathwayGenes: Map<string, string[]>,
  pathwayNameMap: Map<string, string>,
  pathwayLinkMap: Map<string, string | undefined>,
  nodes: ElementDefinition[],
  similarityThreshold: number,
  results: Array<GseaResult>
): Promise<{
  elements: cytoscape.ElementDefinition[];
  stats: any;
}> {
  return new Promise((resolve, reject) => {
    try {
      
      // Create a new worker instance
      const worker = new Worker(new URL('./pathwayEdgeWorker.ts', import.meta.url), { type: 'module' });

      // Set up message handler
      worker.onmessage = (event) => {
        resolve(event.data);
        worker.terminate();
      };

      worker.onerror = (error) => {
        reject(error);
        worker.terminate();
      };

      // Convert Maps to plain objects for serialization
      
      const pathwayGenesObj: Record<string, string[]> = {};
      pathwayGenes.forEach((value, key) => {
        pathwayGenesObj[key] = value;
      });

      const pathwayNameMapObj: Record<string, string> = {};
      pathwayNameMap.forEach((value, key) => {
        pathwayNameMapObj[key] = value;
      });

      const pathwayLinkMapObj: Record<string, string | undefined> = {};
      pathwayLinkMap.forEach((value, key) => {
        pathwayLinkMapObj[key] = value;
      });
      // Send data to worker
      worker.postMessage({
        pathwayIds,
        pathwayGenes: pathwayGenesObj,
        pathwayNameMap: pathwayNameMapObj,
        pathwayLinkMap: pathwayLinkMapObj,
        nodes,
        similarityThreshold,
        results,
      });
    } catch (error) {
      // Fallback to sync computation if worker fails
      resolve(computePathwayEdgesSync(pathwayIds, pathwayGenes, pathwayNameMap, pathwayLinkMap, nodes, similarityThreshold, results));
    }
  });
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
