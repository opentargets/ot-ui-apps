const columns = [
  {
    // !! NEED TO DISPLAY, SORT, ... PROPERLY, AND LINK TO VARIANT !!
    id: "variant.id",
    label: "Variant",
    ensemblId,
  },
  {
    id: "aminoAcidPosition", // UPDATE TYPO ONCE API UPDATED
    label: "Amino acid change",
    sortable: true,
    filterValue: o => `${o.referenceAminoAcid}${o.aminoAcidPosition}${o.alternateAminoAcid}`,
    renderCell: o => `${o.referenceAminoAcid}${o.aminoAcidPosition}${o.alternateAminoAcid}`,
    comparator: (a, b) => a.aminoAcidPosition - b.aminoAcidPosition,
  },
  {
    id: "evidenceSources",
    label: "Evidence counts",
    renderCell: ({ evidenceSources }) => {
      if (evidenceSources?.length > 0) {
        return evidenceSources
          .map(({ evidenceCount, datasourceId }) => `${datasourceId}: ${evidenceCount}`)
          .join(", ");
      }
      return naLabel;
    },
  },
  {
    // MAKE NUMERIC
    id: "maxVariantEffectForPosition",
    label: "Max variant effect for position",
    renderCell: ({ maxVariantEffectForPosition: { method, value } }) =>
      `${method}: ${value.toFixed(2)}`,
    comparator: (a, b) => a.maxVariantEffectForPosition.value - b.maxVariantEffectForPosition.value,
  },
  {
    id: "diseases",
    label: "Disease/phenotype",
    filterValue: ({ diseases }) => diseases.map(({ name }) => name).join(", "),
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
