import { Box, Chip, Tooltip } from "@mui/material";
import { Link, OtTable } from "ui";
import type { GseaResult } from "../api/gseaApi";

interface ResultsTableProps {
  results: GseaResult[];
}

function getColumns() {
  return [
    {
      id: "Pathway",
      label: "Pathway",
      sortable: true,
      renderCell: (row: GseaResult) => (
        <Box>
          {row.Link ? (
            <Link external to={row.Link}>
              {row.Pathway}
            </Link>
          ) : (
            row.Pathway
          )}
          {row.ID && (
            <Box
              component="span"
              sx={{ display: "block", fontSize: "0.75rem", color: "text.secondary" }}
            >
              {row.ID}
            </Box>
          )}
        </Box>
      ),
      exportValue: (row: GseaResult) => row.Pathway,
    },
    {
      id: "NES",
      label: "NES",
      numeric: true,
      sortable: true,
      tooltip: "Normalized Enrichment Score",
      renderCell: (row: GseaResult) => row.NES?.toFixed(3) ?? "-",
      exportValue: (row: GseaResult) => row.NES,
    },
    {
      id: "ES",
      label: "ES",
      numeric: true,
      sortable: true,
      tooltip: "Enrichment Score",
      renderCell: (row: GseaResult) => row.ES?.toFixed(3) ?? "-",
      exportValue: (row: GseaResult) => row.ES,
    },
    {
      id: "p-value",
      label: "P-value",
      numeric: true,
      sortable: true,
      renderCell: (row: GseaResult) => {
        const pval = row["p-value"];
        if (pval == null) return "-";
        return (
          <Chip
            label={pval.toExponential(2)}
            size="small"
            color={pval < 0.05 ? "success" : "default"}
            variant={pval < 0.05 ? "filled" : "outlined"}
          />
        );
      },
      exportValue: (row: GseaResult) => row["p-value"],
    },
    {
      id: "FDR",
      label: "FDR",
      numeric: true,
      sortable: true,
      tooltip: "False Discovery Rate",
      renderCell: (row: GseaResult) => {
        const fdr = row.FDR;
        if (fdr == null) return "-";
        return (
          <Chip
            label={fdr.toExponential(2)}
            size="small"
            color={fdr < 0.05 ? "success" : "default"}
            variant={fdr < 0.05 ? "filled" : "outlined"}
          />
        );
      },
      exportValue: (row: GseaResult) => row.FDR,
    },
    {
      id: "Pathway size",
      label: "Pathway Size",
      numeric: true,
      sortable: true,
      renderCell: (row: GseaResult) => row["Pathway size"]?.toString() ?? "-",
      exportValue: (row: GseaResult) => row["Pathway size"],
    },
    {
      id: "Number of input genes",
      label: "Overlap Genes",
      numeric: true,
      sortable: true,
      renderCell: (row: GseaResult) => row["Number of input genes"]?.toString() ?? "-",
      exportValue: (row: GseaResult) => row["Number of input genes"],
    },
    {
      id: "Leading edge genes",
      label: "Leading Edge Genes",
      sortable: false,
      filterValue: false,
      renderCell: (row: GseaResult) => {
        const genes = row["Leading edge genes"];
        if (!genes || genes === "") return "-";
        const geneList = genes
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean);
        if (geneList.length === 0) return "-";
        const displayGenes = geneList.slice(0, 5);
        const remaining = geneList.length - 5;
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {displayGenes.map((gene, idx) => (
              <Chip
                key={idx}
                label={gene}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            ))}
            {remaining > 0 && (
              <Tooltip title={geneList.slice(5).join(", ")}>
                <Chip
                  label={`+${remaining}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem" }}
                />
              </Tooltip>
            )}
          </Box>
        );
      },
      exportValue: (row: GseaResult) => row["Leading edge genes"],
    },
  ];
}

function ResultsTable({ results }: ResultsTableProps) {
  const columns = getColumns();

  return (
    <OtTable
      columns={columns}
      rows={results}
      sortBy="FDR"
      order="asc"
      showGlobalFilter
      dataDownloader
      dataDownloaderFileStem="gsea-results"
    />
  );
}

export default ResultsTable;
