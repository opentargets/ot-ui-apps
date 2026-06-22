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

  console.log(`[ENRICHMENT_MAP] Computing graph with ${pathwayIds.length} filtered terms (${nodes.length} nodes)`);

  // For larger datasets, use web worker to prevent browser freezing
  // Even 300 nodes = 45K comparisons, use worker to keep UI responsive
  if (nodes.length > 300) {
    console.log(`[ENRICHMENT_MAP] Using web worker for large dataset computation (${pathwayIds.length} pathways)...`);
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

  // For smaller datasets, still use worker if >100 nodes to stay responsive
  if (nodes.length > 100) {
    console.log(`[ENRICHMENT_MAP] Using web worker for medium dataset (${nodes.length} nodes)...`);
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

  // Only use sync for very small datasets
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
 * Offload edge computation to web worker to prevent browser freezing
 */
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
      console.log(`[ENRICHMENT_MAP] Creating web worker...`);
      const workerStartTime = performance.now();
      
      // Create a new worker instance
      const worker = new Worker(new URL('./pathwayEdgesWorker.ts', import.meta.url), { type: 'module' });
      console.log(`[ENRICHMENT_MAP] Worker created successfully`);

      // Set up message handler
      worker.onmessage = (event) => {
        const duration = performance.now() - workerStartTime;
        console.log(`[ENRICHMENT_MAP] ✅ Worker completed in ${duration.toFixed(0)}ms: ${event.data.stats.edges} edges, ${event.data.stats.displayedPathways} pathways`);
        resolve(event.data);
        worker.terminate();
      };

      worker.onerror = (error) => {
        console.error(`[ENRICHMENT_MAP] ❌ Worker error:`, error);
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

      console.log(`[ENRICHMENT_MAP] 📤 Sending ${pathwayIds.length} pathways to worker (${nodes.length} nodes)...`);

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
      console.error(`[ENRICHMENT_MAP] ❌ Failed to create worker, falling back to sync:`, error);
      // Fallback to sync computation if worker fails
      resolve(computePathwayEdgesSync(pathwayIds, pathwayGenes, pathwayNameMap, pathwayLinkMap, nodes, similarityThreshold, results));
    }
  });
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
