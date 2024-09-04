import { Link, TableDrawer, OtTable } from "ui";
import { defaultRowsPerPageOptions } from "../../constants";

import AllelicCompositionDrawer from "./AllelicCompositionDrawer";

const columns = [
  {
    id: "targetInModel",
    label: "Mouse gene",
    renderCell: ({ targetInModel, targetInModelMgiId }) => (
      <Link external to={`https://identifiers.org/${targetInModelMgiId}`}>
        {targetInModel}
      </Link>
    ),
  },
  {
    id: "modelPhenotypeLabel",
    label: "Phenotype",
    renderCell: ({ modelPhenotypeLabel, modelPhenotypeId }) => (
      <Link external to={`https://identifiers.org/${modelPhenotypeId}`}>
        {modelPhenotypeLabel}
      </Link>
    ),
  },
  {
    id: "modelPhenotypeClasses",
    label: "Category",
    filterValue: ({ modelPhenotypeClasses }) => {
      if (modelPhenotypeClasses.length === 1) {
        return modelPhenotypeClasses[0].label;
      }
      return "categories";
    },
    renderCell: ({ modelPhenotypeClasses }) => {
      const entries = modelPhenotypeClasses.map(phenotypeClass => ({
        name: phenotypeClass.label,
        url: `https://identifiers.org/${phenotypeClass.id}`,
        group: "Categories",
      }));
      return (
        <TableDrawer
          caption="Category"
          message={`${modelPhenotypeClasses.length} categories`}
          entries={entries}
        />
      );
    },
    exportValue: ({ modelPhenotypeClasses }) =>
      modelPhenotypeClasses.map(phenotypeClass => phenotypeClass.label),
  },
  {
    id: "allelicComposition",
    label: "Allelic composition",
    renderCell: ({ biologicalModels }) => (
      <AllelicCompositionDrawer biologicalModels={biologicalModels} />
    ),
    exportValue: ({ biologicalModels }) => biologicalModels.map(bm => bm.allelicComposition),
  },
];

function PhenotypesTable({ mousePhenotypes, query, variables, symbol }) {
  return (
    <OtTable
      showGlobalFilter
      dataDownloader
      dataDownloaderFileStem={`${symbol}-mouse-phenotypes`}
      columns={columns}
      rows={mousePhenotypes}
      rowsPerPageOptions={defaultRowsPerPageOptions}
      query={query}
      variables={variables}
    />
  );
}

export default PhenotypesTable;
