import type { ElementDefinition } from "cytoscape";
import type { GseaResult } from "../../../api/gseaApi";

// Import helper functions - these need to be available in worker context
function overlapSimilarity(setA: string[], setB: string[]): number {
  if (setA.length === 0 || setB.length === 0) return 0;
  const b = new Set(setB);
  const intersection = setA.filter((item) => b.has(item)).length;
  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? intersection / union : 0;
}

interface WorkerMessage {
  pathwayIds: string[];
  pathwayGenes: Record<string, string[]>; // Use plain object instead of Map
  pathwayNameMap: Record<string, string>; // Use plain object instead of Map
  pathwayLinkMap: Record<string, string | undefined>; // Use plain object instead of Map
  nodes: ElementDefinition[];
  similarityThreshold: number;
  results: Array<GseaResult>;
}

interface WorkerResult {
  elements: ElementDefinition[];
  stats: {
    totalPathways: number;
    displayedPathways: number;
    edges: number;
    totalGenes: number;
    significantCount: number;
  };
}

// Worker message handler
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  console.log("[WORKER] Processing pathway edges computation");
  const start = performance.now();
  
  const { pathwayIds, pathwayGenes, pathwayNameMap, pathwayLinkMap, nodes, similarityThreshold, results } = event.data;

  // Sort pathways by FDR significance and limit to top 300
  const sortedPathwayIds = pathwayIds
    .map((id) => {
      const result = results.find((r) => (r.ID as string) === id || (r.Pathway as string) === id);
      return { id, fdr: result?.FDR as number || 1 };
    })
    .sort((a, b) => a.fdr - b.fdr)
    .slice(0, 300)
    .map((item) => item.id);

  const edges: ElementDefinition[] = [];
  const edgeSet = new Set<string>();
  let edgeCount = 0;

  for (let i = 0; i < sortedPathwayIds.length; i++) {
    for (let j = i + 1; j < sortedPathwayIds.length; j++) {
      const idA = sortedPathwayIds[i];
      const idB = sortedPathwayIds[j];
      const genesA = pathwayGenes[idA] || [];
      const genesB = pathwayGenes[idB] || [];

      if (genesA.length === 0 || genesB.length === 0) continue;

      const similarity = overlapSimilarity(genesA, genesB);

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
              sourceName: pathwayNameMap[idA],
              targetName: pathwayNameMap[idB],
              sourceLink: pathwayLinkMap[idA],
              targetLink: pathwayLinkMap[idB],
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

  const duration = performance.now() - start;
  console.log(`[WORKER] Computation complete: ${edgeCount} edges in ${duration.toFixed(0)}ms`);

  const result: WorkerResult = {
    elements: [...nodes, ...edges],
    stats: {
      totalPathways: results.length,
      displayedPathways: nodes.length,
      edges: edgeCount,
      totalGenes: 0,
      significantCount: results.filter((r) => (r.FDR as number) < 0.05).length,
    },
  };

  self.postMessage(result);
};

export {};
