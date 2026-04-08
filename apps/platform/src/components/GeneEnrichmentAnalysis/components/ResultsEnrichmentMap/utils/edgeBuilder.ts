import type cytoscape from "cytoscape";
import type { ElementDefinition } from "cytoscape";

/**
 * Build edges for gene view (expensive operation moved to separate function)
 * Uses setTimeout to break computation into chunks, freeing up the main thread
 *
 * @param sortedGenes - Array of gene IDs sorted by pathway count
 * @param filteredGeneToPathways - Map of genes to their pathways with metadata
 * @param similarityThreshold - User-defined threshold (1-10 scale, converts to Jaccard)
 * @param jaccardFn - Function to calculate Jaccard similarity
 * @returns Promise with edges array and edge count
 */
export async function buildGeneViewEdges(
  sortedGenes: string[],
  filteredGeneToPathways: Map<string, Array<{ pathway: string; fdr: number; nes: number }>>,
  similarityThreshold: number,
  jaccardFn: (setA: string[], setB: string[]) => number
): Promise<{
  edges: cytoscape.ElementDefinition[];
  edgeCount: number;
}> {
  const edges: cytoscape.ElementDefinition[] = [];
  const edgeSet = new Set<string>();
  let edgeCount = 0;
  const jaccardThreshold = similarityThreshold / 10;
  const CHUNK_SIZE = 50; // Process edges in chunks

  for (let i = 0; i < sortedGenes.length; i++) {
    // Yield to main thread every CHUNK_SIZE iterations
    if (i > 0 && i % CHUNK_SIZE === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    for (let j = i + 1; j < sortedGenes.length; j++) {
      const geneA = sortedGenes[i];
      const geneB = sortedGenes[j];
      const pathwaysAData = filteredGeneToPathways.get(geneA);
      const pathwaysBData = filteredGeneToPathways.get(geneB);
      if (!pathwaysAData || !pathwaysBData) continue;

      const pathwaysA = pathwaysAData.map((p) => p.pathway);
      const pathwaysB = pathwaysBData.map((p) => p.pathway);

      // Calculate Jaccard coefficient as per Enrichment Map paper
      const jaccard = jaccardFn(pathwaysA, pathwaysB);

      // Filter by Jaccard coefficient threshold
      if (jaccard >= jaccardThreshold) {
        const edgeId = `${geneA}-${geneB}`;
        if (!edgeSet.has(edgeId)) {
          edgeSet.add(edgeId);

          const setA = new Set(pathwaysA);
          const sharedPathways = pathwaysB.filter((p) => setA.has(p));
          const sharedFDRs = sharedPathways
            .map((p) => pathwaysAData.find((pw) => pw.pathway === p)?.fdr || 1)
            .sort((a, b) => a - b);
          const bestSharedFDR = sharedFDRs[0];

          edges.push({
            data: {
              id: edgeId,
              source: geneA,
              target: geneB,
              sharedPathways,
              sharedCount: sharedPathways.length,
              jaccardCoefficient: jaccard,
              edgeWidth: Math.max(1, jaccard * 3),
              edgeOpacity: Math.min(1, Math.max(0.3, jaccard)),
              bestSharedFDR: bestSharedFDR,
            },
          });
          edgeCount++;
        }
      }
    }
  }

  return { edges, edgeCount };
}

export async function buildGeneViewEdgesOptimized(
  genes: string[],
  geneToPathways: Map<string, Array<{ pathway: string; fdr: number; nes: number }>>,
  threshold: number,
  similarityFn: (
    g1: string,
    g2: string,
    map: Map<string, Array<{ pathway: string; fdr: number; nes: number }>>
  ) => number,
  isMountedRef: React.MutableRefObject<boolean>
): Promise<{ edges: ElementDefinition[]; edgeCount: number }> {
  const edges: ElementDefinition[] = [];
  let comparisonsMade = 0;
  let comparisonsSkipped = 0;

  // Pre-compute pathway sets for each gene (optimization)
  const genePathwaySets = new Map<string, Set<string>>();
  for (const gene of genes) {
    const pathways = geneToPathways.get(gene);
    if (pathways) {
      genePathwaySets.set(gene, new Set(pathways.map((p) => p.pathway)));
    }
  }

  // Helper: count shared pathways between two genes
  const countSharedPathways = (g1: string, g2: string): number => {
    const p1 = genePathwaySets.get(g1);
    const p2 = genePathwaySets.get(g2);
    if (!p1 || !p2) return 0;

    let count = 0;
    for (const pathway of p1) {
      if (p2.has(pathway)) count++;
    }
    return count;
  };

  // Build edges with pre-filtering
  for (let i = 0; i < genes.length; i++) {
    // Check if component is still mounted periodically
    if (i % 100 === 0 && !isMountedRef.current) {
      console.log("[GENE_VIEW] Aborting edge computation - component unmounted");
      return { edges: [], edgeCount: 0 };
    }

    for (let j = i + 1; j < genes.length; j++) {
      const gene1 = genes[i];
      const gene2 = genes[j];

      // PRE-FILTER: Skip if genes share fewer than 2 pathways
      const sharedCount = countSharedPathways(gene1, gene2);
      if (sharedCount < 2) {
        comparisonsSkipped++;
        continue;
      }

      // Compute expensive Jaccard similarity only for promising pairs
      const similarity = similarityFn(gene1, gene2, geneToPathways);
      comparisonsMade++;

      if (similarity >= threshold) {
        // Get actual shared pathways for tooltip display
        const p1 = genePathwaySets.get(gene1);
        const p2 = genePathwaySets.get(gene2);
        const sharedPathways: string[] = [];
        if (p1 && p2) {
          for (const pathway of p1) {
            if (p2.has(pathway)) {
              sharedPathways.push(pathway);
            }
          }
        }

        edges.push({
          data: {
            id: `${gene1}-${gene2}`,
            source: gene1,
            target: gene2,
            similarity,
            sharedPathways,
            sharedCount,
          },
        });
      }
    }
  }

  console.log(
    `[GENE_VIEW] Edge building: ${comparisonsMade} comparisons made, ${comparisonsSkipped} skipped (${(
      (comparisonsSkipped / (comparisonsMade + comparisonsSkipped)) * 100
    ).toFixed(1)}% reduction)`
  );

  return { edges, edgeCount: edges.length };
}
