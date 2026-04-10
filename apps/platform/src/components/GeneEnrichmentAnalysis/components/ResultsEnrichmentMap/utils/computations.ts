import type { ElementDefinition } from "cytoscape";
import { buildGeneViewEdgesOptimized } from "./edgeBuilder";
import { getGeneList, jaccardSimilarity } from "./index";
import type { ComputedStats } from "./types";

/**
 * Builds gene view edges asynchronously
 */

export async function computeGeneViewEdges(
  results: Array<Record<string, unknown>>,
  nodes: ElementDefinition[],
  similarityThreshold: number,
  isMountedRef: React.MutableRefObject<boolean>,
  onComplete: (elements: ElementDefinition[], stats: ComputedStats) => void,
  onError: (err: Error) => void,
  significanceCutoff: number = 0.25  // More permissive default
): Promise<void> {
  try {
    // Only use highly significant pathways
    const significantResults = results.filter(
      (r) => (r.FDR as number) < significanceCutoff
    );

    // If no significant pathways at strict cutoff, relax and retry
    if (significantResults.length === 0 && significanceCutoff < 0.25) {
      console.log(
        `[GENE_VIEW] No pathways with FDR < ${significanceCutoff}, relaxing to FDR<0.25`
      );
      return computeGeneViewEdges(
        results,
        nodes,
        similarityThreshold,
        isMountedRef,
        onComplete,
        onError,
        0.25  // Retry with more permissive cutoff
      );
    }

    // Early exit if still no significant pathways after relaxation
    if (significantResults.length === 0) {
      console.log(`[GENE_VIEW] No pathways with FDR < ${significanceCutoff}`);
      onComplete(nodes, {
        totalGenes: nodes.length,
        edges: 0,
        totalPathways: results.length,
        significantCount: 0,
      });
      return;
    }

    const geneToPathways = new Map<
      string,
      Array<{ pathway: string; fdr: number; nes: number }>
    >();

    // Only process genes from significant pathways
    for (const r of significantResults) {
      const geneList_ = getGeneList(r);
      for (const gene of geneList_) {
        if (!geneToPathways.has(gene)) {
          geneToPathways.set(gene, []);
        }
        geneToPathways.get(gene)!.push({
          pathway: r.Pathway as string,
          fdr: r.FDR as number,
          nes: r.NES as number,
        });
      }
    }

    // Filter to genes in multiple significant pathways
    const sortedGenes = Array.from(geneToPathways.entries())
      .filter(([_, pathways]) => pathways.length >= 2)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 500)
      .map(([gene]) => gene);

    // If very few genes, relax the filter
    if (sortedGenes.length < 10 && significanceCutoff < 0.25) {
      console.log(
        `[GENE_VIEW] Only ${sortedGenes.length} genes at FDR<${significanceCutoff}, relaxing to FDR<0.25`
      );
      return computeGeneViewEdges(
        results,
        nodes,
        similarityThreshold,
        isMountedRef,
        onComplete,
        onError,
        0.25  // Retry with more permissive cutoff
      );
    }

    const filteredGeneToPathways = new Map(
      sortedGenes.map((gene) => [gene, geneToPathways.get(gene)!])
    );

    // Wrapper function to adapt jaccardSimilarity to buildGeneViewEdgesOptimized's expected signature
    const computeSimilarity = (
      gene1: string,
      gene2: string,
      map: Map<string, Array<{ pathway: string; fdr: number; nes: number }>>
    ): number => {
      const pathways1 = map.get(gene1)?.map((p) => p.pathway) ?? [];
      const pathways2 = map.get(gene2)?.map((p) => p.pathway) ?? [];
      return jaccardSimilarity(pathways1, pathways2);
    };

    const { edges, edgeCount } = await buildGeneViewEdgesOptimized(
      sortedGenes,
      filteredGeneToPathways,
      similarityThreshold,
      computeSimilarity,
      isMountedRef
    );

    if (!isMountedRef.current) {
      console.log("[GENE_VIEW] Skipping setState - component unmounted");
      return;
    }

    onComplete([...nodes, ...edges], {
      totalGenes: nodes.length,
      edges: edgeCount,
      totalPathways: results.length,
      significantCount: results.filter((r) => (r.FDR as number) < 0.05).length,
    });
  } catch (err) {
    if (!isMountedRef.current) {
      console.log("[GENE_VIEW] Error logged but component unmounted:", err);
      return;
    }
    onError(err as Error);
  }
}
// export async function computeGeneViewEdges(
//   results: Array<Record<string, unknown>>,
//   nodes: ElementDefinition[],
//   similarityThreshold: number,
//   isMountedRef: React.MutableRefObject<boolean>,
//   onComplete: (elements: ElementDefinition[], stats: ComputedStats) => void,
//   onError: (err: Error) => void
// ): Promise<void> {
//   try {
//     const significantResults = results.filter((r) => (r.FDR as number) < 0.25);
//     const displayResults =
//       significantResults.length > 0 ? significantResults : results.slice(0, 50);

//     const geneToPathways = new Map<
//       string,
//       Array<{ pathway: string; fdr: number; nes: number }>
//     >();

//     for (const r of displayResults) {
//       const geneList_ = getGeneList(r);
//       for (const gene of geneList_) {
//         if (!geneToPathways.has(gene)) {
//           geneToPathways.set(gene, []);
//         }
//         const pathwaysForGene = geneToPathways.get(gene);
//         if (pathwaysForGene) {
//           pathwaysForGene.push({
//             pathway: r.Pathway as string,
//             fdr: r.FDR as number,
//             nes: r.NES as number,
//           });
//         }
//       }
//     }

//     const sortedGenes = Array.from(geneToPathways.entries())
//       .filter(([_, pathways]) => pathways.length >= 2)
//       .sort((a, b) => b[1].length - a[1].length)
//       .slice(0, 500)
//       .map(([gene]) => gene);

//     const filteredGeneToPathways = new Map<
//       string,
//       Array<{ pathway: string; fdr: number; nes: number }>
//     >();
//     for (const gene of sortedGenes) {
//       const pathways = geneToPathways.get(gene);
//       if (pathways) {
//         filteredGeneToPathways.set(gene, pathways);
//       }
//     }

//     const { edges, edgeCount } = await buildGeneViewEdges(
//       sortedGenes,
//       filteredGeneToPathways,
//       similarityThreshold,
//       jaccardSimilarity
//     );

//     if (!isMountedRef.current) {
//       console.log("[GENE_VIEW] Skipping setState - component unmounted");
//       return;
//     }

//     onComplete([...nodes, ...edges], {
//       totalGenes: nodes.length,
//       edges: edgeCount,
//       totalPathways: displayResults.length,
//       significantCount: displayResults.filter((r) => (r.FDR as number) < 0.05).length,
//     });
//   } catch (err) {
//     if (!isMountedRef.current) {
//       console.log("[GENE_VIEW] Error logged but component unmounted:", err);
//       return;
//     }
//     onError(err as Error);
//   }
// }


/**
 * Computes pathway view elements (nodes and edges)
 */
export function computePathwayViewElements(
  results: Array<Record<string, unknown>>,
  nodes: ElementDefinition[],
  similarityThreshold: number
): {
  elements: cytoscape.ElementDefinition[];
  stats: ComputedStats;
} {
  const significantResults = results.filter((r) => (r.FDR as number) < 0.25);
  const displayResults =
    significantResults.length > 0 ? significantResults : results.slice(0, 50);

  const geneToPathways = new Map<string, string[]>();

  for (const r of displayResults) {
    const geneList_ = getGeneList(r);
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

  const edges: cytoscape.ElementDefinition[] = [];
  let edgeCount = 0;
  const pathwayGenes = new Map<string, string[]>();
  for (const r of displayResults) {
    pathwayGenes.set(r.ID as string || (r.Pathway as string), getGeneList(r));
  }

  const pathwayIds = Array.from(pathwayGenes.keys());
  const edgeSet = new Set<string>();

  for (let i = 0; i < pathwayIds.length; i++) {
    for (let j = i + 1; j < pathwayIds.length; j++) {
      const idA = pathwayIds[i];
      const idB = pathwayIds[j];
      const genesA = pathwayGenes.get(idA) || [];
      const genesB = pathwayGenes.get(idB) || [];

      if (genesA.length === 0 || genesB.length === 0) continue;

      const jaccard = jaccardSimilarity(genesA, genesB);
      const minPathwayThreshold = 0.15;
      const jaccardThreshold = Math.max(minPathwayThreshold, similarityThreshold / 10);

      if (jaccard >= jaccardThreshold) {
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
              sharedGenes,
              sharedCount: sharedGenes.length,
              jaccardCoefficient: jaccard,
              edgeWidth: Math.max(1.5, jaccard * 5),
              edgeOpacity: Math.min(1, Math.max(0.5, jaccard * 1.5)),
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
      totalGenes: geneToPathways.size,
      significantCount: results.filter((r) => (r.FDR as number) < 0.05).length,
    },
  };
}
