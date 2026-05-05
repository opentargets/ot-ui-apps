# Shortest Path Queries for Enrichment Maps

This document describes the shortest path query features in the Enrichment Map visualization.

## Overview

Shortest path queries answer the fundamental biological question: **"How are two things connected?"** in the pathway network. This feature includes two powerful capabilities:

### 1. **Two-Pathway Shortest Paths** 🔗
Find the gene-connection chain between any two pathways in the network.

**Use case:** If you want to understand the mechanistic route connecting "DNA Repair" and "Apoptosis," shortest path will show you the intermediate pathways and the specific genes linking them.

**How it works:**
- Opens the "Find Pathway Path" dialog
- Enter two pathway names
- Algorithm: Dijkstra's shortest path using gene overlap (Jaccard coefficient) as edge weights
- Stronger gene overlaps = shorter distances in the algorithm
- Results show the complete pathway chain and connecting genes

**Visual feedback:**
- Red borders and glow: Pathways in the shortest path
- Red edges: Connections used in the shortest path
- Hover to see connecting genes

### 2. **Gene-Centric Shortest Paths** 🎯
When you search for a gene (e.g., "TP53"), the system:
1. **Finds all pathways** containing that gene in their leading edge genes
2. **Computes the subgraph** of shortest paths connecting these pathways through the network
3. **Highlights the minimal network** showing how the gene influences pathway connections

**Use case:** Answer "What is this gene doing in my experiment?" by seeing:
- Which pathways contain this gene directly (blue borders)
- Which intermediate pathways connect them (red borders)
- The full mechanistic picture through gene-pathway relationships

**How it works:**
- Type a gene symbol in the search field (e.g., "TP53")
- Toggle "🎯 Gene-Centric Paths ON" chip
- The system computes:
  - Source pathways: pathways with this gene in leading edges (blue highlight)
  - Connected pathways: intermediate pathways linking sources (red highlight)
  - Direct connections: edges carrying this gene (orange emphasis)

**Visual feedback:**
- **Blue borders + glow:** Pathways containing the search gene
- **Red borders + glow:** Intermediate pathways in the connecting network
- **Orange edges:** Edges that directly carry the search gene
- **Dimmed elements:** Everything else

## Implementation Details

### Algorithm: Dijkstra's Shortest Path

The implementation uses Dijkstra's algorithm with Jaccard coefficient-based weights:

```
Weight = 1 / Jaccard(pathwayA, pathwayB)
```

This means:
- Higher gene overlap (higher Jaccard) = lower weight = preferred path
- The algorithm finds the path with the strongest chain of gene connections
- Distance represents the "resistance" to flow (inverse of connection strength)

### Key Functions

#### `findShortestPath(cy, sourceId, targetId)`
Finds the shortest path between two pathway nodes using Dijkstra's algorithm.

**Returns:**
- `pathFound`: boolean
- `pathNodeIds`: Array of pathway IDs in the path (in order)
- `pathEdgeIds`: Array of edge IDs in the path
- `distance`: Total path distance (lower = stronger connections)
- `connectingGenes`: Array of genes shared in the path edges

#### `findPathwaysWithGeneInLeadingEdge(cy, searchGene)`
Finds all pathways that contain a gene in their leading edge genes.

**Returns:** Set of pathway node IDs

#### `computeGeneSubgraph(cy, targetPathwayIds, searchGene?)`
Computes the minimal subgraph connecting a set of target pathways.

**Returns:**
- `connectedNodeIds`: All pathways in the minimal connecting network
- `connectedEdgeIds`: All edges in the minimal connecting network
- `shortestPaths`: Map of shortest paths between each pair of target pathways

#### `filterEdgesByGene(cy, gene)`
Finds all edges that carry a specific gene in their shared genes.

**Returns:** Set of edge IDs

### Gene Search Modes

#### Mode 1: Direct Gene Match (Default)
```
searchGene = "TP53"
useGeneCentricPaths = false
```
Shows only edges and nodes that directly contain the gene.

#### Mode 2: Gene-Centric Shortest Paths
```
searchGene = "TP53"
useGeneCentricPaths = true
```
Shows all pathways containing the gene plus the shortest path network connecting them.

## UI Controls

### Gene Search Box
Located in the collapsible Controls panel (top-right):

1. **Search field:** Type gene symbol (case-insensitive, converts to uppercase)
2. **Clear button (X):** Removes search and clears highlights
3. **Toggle chip:** Switch between "🔍 Direct Gene Match" and "🎯 Gene-Centric Paths ON"
   - Only visible when a gene is searched
   - Click to toggle modes

### Find Pathway Path Button
Also in the Controls panel:

1. Click the "Find Pathway Path" button
2. Enter source pathway name
3. Enter target pathway name
4. Click "Find Path"
5. Results show:
   - ✅ Path found with distance score and connecting genes
   - ❌ No path found message if pathways aren't connected

## Color Coding

### Node Colors (in shortest path queries)
- **Blue border + glow:** Gene source pathways (contain the search gene)
- **Red border + glow:** Shortest path pathways (in the connecting network)
- **Orange border:** Source pathways that are also in shortest path
- **Yellow:** Selected nodes (standard Cytoscape selection)

### Edge Colors (in shortest path queries)
- **Red line:** Edges in the shortest path
- **Orange line:** Edges carrying the search gene
- **Light blue:** Normal pathway connections
- **Dimmed:** Elements not in the query result

## Data Structures

### Node Data

Pathway nodes contain:
```javascript
{
  id: "pathway_id",
  displayLabel: "Pathway Name",
  color: "#color_hex",
  borderColor: "#color_hex",
  size: 30,  // diameter in pixels
  // ... other pathway data
  leadingEdgeGenes: ["GENE1", "GENE2", ...],  // Used by gene search
}
```

### Edge Data

Edges between pathways contain:
```javascript
{
  id: "pathway_a-pathway_b",
  source: "pathway_a",
  target: "pathway_b",
  sharedGenes: ["GENE1", "GENE2", ...],  // Genes shared by both pathways
  sharedCount: 5,  // Number of shared genes
  jaccardCoefficient: 0.25,  // Gene overlap (0-1)
  edgeWidth: 0.75,  // Proportional to Jaccard
  edgeOpacity: 0.3,  // Proportional to Jaccard
}
```

## Performance Considerations

### Dijkstra's Algorithm
- **Time complexity:** O((V + E) log V) with binary heap
- **Space complexity:** O(V) for distance and previous maps
- For typical enrichment maps (100-500 pathways), computes in <100ms

### Gene-Centric Subgraph
- Computes shortest paths between all pairs of source pathways
- For 10 source pathways: 45 path computations
- Visualizes the minimal union of these paths

### Optimization Tips
1. Use FDR threshold to reduce pathway count
2. Increase Jaccard similarity threshold to reduce edges
3. Gene-centric paths compute on-demand (only when mode is toggled)

## Examples

### Example 1: Two-Pathway Query

**Question:** How is "DNA Repair" connected to "Apoptosis"?

**Steps:**
1. Click "Find Pathway Path"
2. Enter "DNA repair" (source)
3. Enter "Apoptosis" (target)
4. Click "Find Path"

**Results:** Shows pathway chain like:
```
DNA Repair → p53 Signaling → Apoptosis
(via genes: TP53, CASP3, BAX)
```

### Example 2: Gene-Centric Query

**Question:** What is TP53 doing in my experiment?

**Steps:**
1. Type "TP53" in gene search box
2. Click the toggle chip to switch to "🎯 Gene-Centric Paths"

**Results:** Shows:
- Blue pathways: Stress Response, DNA Damage, p53 Signaling (contain TP53)
- Red pathways: Cell Cycle, Apoptosis (connect through TP53)
- Orange edges: Direct TP53 connections
- Network visualization: How TP53 coordinates the pathway response

## Edge Cases

### No Path Found
- Two pathways are isolated (no shared genes in any connection chain)
- Increase Jaccard similarity threshold to reduce the network and enable connections

### Single Pathway with Gene
- Gene-centric paths shows only that one pathway (no connections)
- Increasing FDR or reducing Jaccard threshold may reveal connections

### Large Gene Lists
- Searching a common gene (e.g., "EGFR") may highlight many pathways
- System will compute all shortest paths between them
- Performance remains good for typical sizes (<1000 pathways)

## Styling Classes

The visualization uses these CSS classes for styling:

- `.shortestPath` - Pathway nodes or edges in the shortest path (red)
- `.geneSource` - Pathway nodes containing the search gene (blue)
- `.highlighted` - General highlighting (orange)
- `.dimmed` - Elements not matching query (very faint)

See `stylesheet.ts` for full style definitions.

## Files Modified/Created

### New Files
- `utils/shortestPath.ts` - Core shortest path algorithms
- `components/PathwaySelectionModal.tsx` - UI for two-pathway queries

### Modified Files
- `utils/geneSearch.ts` - Enhanced with gene-centric path computation
- `utils/stylesheet.ts` - Added styling for shortest path visualization
- `utils/index.ts` - Exports for new functions
- `components/EnrichmentMapControls.tsx` - UI for pathway selection and gene search modes
- `components/index.ts` - Exports for PathwaySelectionModal
- `ResultsEnrichmentMap.tsx` - Integration of shortest path features

## Future Enhancements

Potential improvements:
1. **Path filtering:** Filter paths by minimum Jaccard coefficient
2. **Alternative paths:** Show top-K shortest paths, not just the shortest
3. **Path history:** Save and compare previous queries
4. **Gene flow visualization:** Animate gene flow along the shortest path
5. **Export:** Save pathway chains as images or data
6. **Network metrics:** Display network centrality and importance scores
