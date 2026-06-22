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

// Color mapping function (replicated from colorPalettes.ts)
function mapToPrioritizationColor(
  value: number,
  minValue: number,
  maxValue: number,
  palette: string[]
): string {
  if (maxValue === minValue) {
    return palette[Math.floor(palette.length / 2)];
  }
  const normalized = (value - minValue) / (maxValue - minValue);
  const colorIndex = Math.floor(normalized * (palette.length - 1));
  return palette[Math.max(0, Math.min(colorIndex, palette.length - 1))];
}

// Filter nodes without edges
function filterNodesWithoutEdges(elements: ElementDefinition[]): { elements: ElementDefinition[]; droppedNodesCount: number } {
  const edgeSourceTargets = new Set<string>();
  for (const el of elements) {
    if (el.data?.source && el.data?.target) {
      edgeSourceTargets.add(el.data.source as string);
      edgeSourceTargets.add(el.data.target as string);
    }
  }

  let droppedNodesCount = 0;
  const filtered = elements.filter((el) => {
    if (!el.data?.source) {
      // This is a node
      if (!edgeSourceTargets.has(el.data?.id as string)) {
        droppedNodesCount++;
        return false;
      }
    }
    return true;
  });

  return { elements: filtered, droppedNodesCount };
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
    droppedNodesCount?: number;
  };
}

// Worker message handler
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  console.log("[WORKER] ⏱️ Processing pathway edges computation");
  const start = performance.now();
  
  const { pathwayIds, pathwayGenes, pathwayNameMap, pathwayLinkMap, nodes, similarityThreshold, results, nesValueMap, displayNesRange, nesColorPalette } = event.data;
  console.log(`[WORKER] 📥 Received: ${pathwayIds.length} pathways, ${nodes.length} nodes, ${results.length} results`);

  // Sort pathways by FDR significance and limit to top 300
  const sortStart = performance.now();
  const sortedPathwayIds = pathwayIds
    .map((id) => {
      const result = results.find((r) => (r.ID as string) === id || (r.Pathway as string) === id);
      return { id, fdr: result?.FDR as number || 1 };
    })
    .sort((a, b) => a.fdr - b.fdr)
    .slice(0, 300)
    .map((item) => item.id);
  console.log(`[WORKER] 🔄 Sorting & filtering took ${(performance.now() - sortStart).toFixed(0)}ms, ${sortedPathwayIds.length} pathways to process`);

  const edges: ElementDefinition[] = [];
  const edgeSet = new Set<string>();
  let edgeCount = 0;
  const edgeStart = performance.now();
  
  // OPTIMIZATION: Build gene index to only compare pathways that share genes
  // This reduces comparisons from ~45k to typically <5k for sparse gene networks
  console.log(`[WORKER] 🔧 Building gene index for ${sortedPathwayIds.length} pathways...`);
  const geneIndex = new Map<string, string[]>();
  for (const pathwayId of sortedPathwayIds) {
    const genes = pathwayGenes[pathwayId] || [];
    for (const gene of genes) {
      if (!geneIndex.has(gene)) {
        geneIndex.set(gene, []);
      }
      geneIndex.get(gene)!.push(pathwayId);
    }
  }
  console.log(`[WORKER] ✓ Gene index built: ${geneIndex.size} unique genes`);

  // Track compared pairs to avoid duplicates when pathways share multiple genes
  const comparedPairs = new Set<string>();
  let comparisonCount = 0;

  // Only compare pathways that actually share genes
  for (const [gene, pathwaysWithGene] of geneIndex.entries()) {
    // Compare all pairs of pathways containing this gene
    for (let i = 0; i < pathwaysWithGene.length; i++) {
      for (let j = i + 1; j < pathwaysWithGene.length; j++) {
        const idA = pathwaysWithGene[i];
        const idB = pathwaysWithGene[j];
        
        // Create canonical pair key to avoid comparing same pair twice
        const pairKey = idA < idB ? `${idA}-${idB}` : `${idB}-${idA}`;
        
        if (!comparedPairs.has(pairKey)) {
          comparedPairs.add(pairKey);
          comparisonCount++;
          
          const genesA = pathwayGenes[idA] || [];
          const genesB = pathwayGenes[idB] || [];

          if (genesA.length === 0 || genesB.length === 0) continue;

          const similarity = overlapSimilarity(genesA, genesB);

          const minThreshold = 0.01;
          const threshold = Math.max(minThreshold, similarityThreshold / 10);

          if (similarity >= threshold) {
            if (!edgeSet.has(pairKey)) {
              edgeSet.add(pairKey);

              const setA = new Set(genesA);
              const sharedGenes = genesB.filter((g) => setA.has(g));

              edges.push({
                data: {
                  id: pairKey,
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
    }
  }

  const edgeDuration = performance.now() - edgeStart;
  const duration = performance.now() - start;
  const potentialComparisons = (sortedPathwayIds.length * (sortedPathwayIds.length - 1)) / 2;
  const reductionPercent = ((1 - comparisonCount / potentialComparisons) * 100).toFixed(1);
  console.log(`[WORKER] ✅ Edge computation: ${edgeCount} edges from ${comparisonCount} actual comparisons (avoided ${reductionPercent}% vs brute force)`);

  // FILTER & COLOR: Remove nodes without edges and apply NES coloring
  const filterStart = performance.now();
  const allElements = [...nodes, ...edges];
  const { elements: filteredElements, droppedNodesCount } = filterNodesWithoutEdges(allElements);
  console.log(`[WORKER] 🔧 Filtered to ${filteredElements.length} elements (dropped ${droppedNodesCount} nodes) in ${(performance.now() - filterStart).toFixed(0)}ms`);

  const colorStart = performance.now();
  let coloredCount = 0;
  const coloredElements = filteredElements.map((el) => {
    if (el.data?.source) return el; // Keep edges as-is
  // FILTER: Remove nodes without edges (keep original node data intact for main thread coloring)
  const filterStart = performance.now();
  const allElements = [...nodes, ...edges];
  const { elements: filteredElements, droppedNodesCount } = filterNodesWithoutEdges(allElements);
  console.log(`[WORKER] 🔧 Filtered to ${filteredElements.length} elements (dropped ${droppedNodesCount} nodes) in ${(performance.now() - filterStart).toFixed(0)}ms`);

  const totalDuration = performance.now() - start;
  console.log(`[WORKER] ⏱️ Total computation: ${totalDuration.toFixed(0)}ms`);

  const result: WorkerResult = {
    elements: filteredElements, // Return filtered but uncolored elements
    stats: {
      totalPathways: results.length,
      displayedPathways: filteredElements.filter((el) => !el.data?.source).length,
      edges: edgeCount,
      totalGenes: 0,
      significantCount: results.filter((r) => (r.FDR as number) < 0.05).length,
      droppedNodesCount,
    },
  };

  console.log(`[WORKER] 📤 Sending ${result.elements.length} filtered elements`);
  self.postMessage(result);
};

export {};