import { OtTable, Link, Tooltip } from "ui";
import { Typography, Box } from "@mui/material";
import { useStateValue, useActions } from "./Context";
import { naLabel } from "@ot/constants";

export default function OverlappingVariantsTable() {
  const { state, filteredRows } = useStateValue();
  const { setHoveredRow, setUnhoveredRow } = useActions();

  const columns = [
    {
      // !! NEED TO DISPLAY, SORT, ... PROPERLY, AND LINK TO VARIANT !!
      id: "variant.id",
      label: "Variant",
    },
    {
      id: "aminoAcidPosition", // UPDATE TYPO ONCE API UPDATED
      label: "Amino acid change",
      sortable: true,
      // filterValue: o => `${o.referenceAminoAcid}${o.aminoAcidPosition}${o.alternateAminoAcid}`,
      renderCell: o => `${o.referenceAminoAcid}${o.aminoAcidPosition}${o.alternateAminoAcid}`,
      comparator: (a, b) => a.aminoAcidPosition - b.aminoAcidPosition,
    },
    {
      id: "datasources",
      label: "Evidence counts",
      renderCell: ({ datasources }) => {
        if (datasources?.length > 0) {
          return datasources
            .map(
              ({ datasourceCount, datasourceNiceName }) =>
                `${datasourceNiceName}: ${datasourceCount}`
            )
            .join(", ");
        }
        return naLabel;
      },
    },
    // {
    //   id: "variantEffect",
    //   label: "Alpha Missense",
    //   renderCell: ({ variantEffect }) => variantEffect?.toFixed(2) ?? naLabel,
    // },
    {
      id: "variantConsequences",
      label: "Most severe consequence",
      sortable: true,
      comparator: (a, b) =>
        a.variantConsequences[0].label.localeCompare(b.variantConsequences[0].label),
      renderCell: ({ variantConsequences }) => variantConsequences[0].label,
    },
    {
      id: "diseases",
      label: "Disease/phenotype",
      // filterValue: ({ diseases }) => diseases.map(({ name }) => name).join(", "),
      renderCell: ({ diseases }) => {
        if (diseases.length === 0) return naLabel;
        const elements = [<Link to={`/disease/${diseases[0].id}`}>{diseases[0].name}</Link>];
        if (diseases.length > 1) {
          elements.push(", ", <Link to={`/disease/${diseases[1].id}`}>{diseases[1].name}</Link>);
          if (diseases.length > 2) {
            elements.push(
              <Tooltip
                title={diseases
                  .slice(2)
                  .map(({ id, name }) => <Link to={`/disease/${id}`}>{name}</Link>)
                  .reduce((accum, current) => {
                    accum.push(current, ", ");
                    return accum;
                  }, [])}
                showHelpIcon
              >
                <Typography variant="caption" ml={1}>
                  +{diseases.length - 2} more
                </Typography>
              </Tooltip>
            );
          }
        }
        return elements;
      },
    },

    // !! MORE ROWS !!
  ];

  function getEnteredRow(enteredRow) {
    setHoveredRow(enteredRow.original);
  }

  function getExitedRow(exitedRow) {
    setUnhoveredRow();
  }

  return (
    <Box
      onMouseLeave={() => {
        setUnhoveredRow();
      }}
    >
      <OtTable
        dataDownloader
        showGlobalFilter={false}
        sortBy="aminoAcidPosition"
        order="asc"
        columns={columns}
        rows={filteredRows}
        query={state.query}
        variables={state.variables}
        getEnteredRow={getEnteredRow}
        getExitedRow={getExitedRow}
      />
    </Box>
  );
}
