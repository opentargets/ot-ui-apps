import { useQuery } from "@apollo/client";
import { makeStyles } from "@mui/styles";
import { SectionItem, Link, Tooltip, OtTable, TooltipStyledLabel } from "ui";

import { definition } from ".";
import Description from "./Description";
import { dataTypesMap } from "../../dataTypes";
import { defaultRowsPerPageOptions, sectionsBaseSizeQuery } from "../../constants";

import CRISPR_QUERY from "./OTCrisprQuery.gql";

const useStyles = makeStyles(theme => ({
  significanceIcon: {
    color: theme.palette.primary.main,
  },
}));

const getColumns = () => [
  {
    id: "disease",
    label: "Reported disease",
    renderCell: row => <Link to={`/disease/${row.disease.id}`}>{row.disease.name}</Link>,
    filterValue: row => `${row.disease.name}, ${row.disease.id}`,
  },
  {
    id: "projectId",
    label: "OTAR project code",
    renderCell: row => (
      <Link external to={`http://home.opentargets.org/${row.projectId}`}>
        {row.projectId}
      </Link>
    ),
  },
  {
    id: "contrast",
    label: "Contrast / Study overview",
    renderCell: row => {
      if (row.contrast && row.studyOverview) {
        return (
          <Tooltip
            showHelpIcon
            title={<TooltipStyledLabel label="Study overview" description={row.studyOverview} />}
          >
            <span>{row.contrast}</span>
          </Tooltip>
        );
      }
      if (row.contrast) {
        return <span>{row.contrast}</span>;
      }
      if (row.studyOverview) {
        return <span>{row.studyOverview}</span>;
      }
      return null;
    },
    width: "25%",
    filterValue: row => `${row.contrast}; ${row.studyOverview}`,
  },
  {
    id: "cellType",
    label: "Cell type",
    renderCell: row =>
      row.cellLineBackground ? (
        <Tooltip
          showHelpIcon
          title={
            <TooltipStyledLabel label="Cell line background" description={row.cellLineBackground} />
          }
        >
          <span>{row.cellType}</span>
        </Tooltip>
      ) : (
        row.cellType
      ),
    filterValue: row => `${row.cellType}; ${row.cellLineBackground}`,
  },
  {
    id: "log2FoldChangeValue",
    label: "log2 fold change",
    renderCell: row => (row.log2FoldChangeValue ? row.log2FoldChangeValue : "N/A"),
  },
  {
    id: "resourceScore",
    label: "Significance",
    filterValue: row => `${row.resourceScore}; ${row.statisticalTestTail}`,
    renderCell: row => (row.resourceScore ? parseFloat(row.resourceScore.toFixed(6)) : "N/A"),
  },
  {
    id: "releaseVersion",
    label: "Release version",
  },
];

const exportColumns = [
  {
    label: "disease",
    exportValue: row => row.disease.name,
  },
  {
    label: "disease id",
    exportValue: row => row.disease.id,
  },
  {
    label: "OTAR project code",
    exportValue: row => row.projectId,
  },
  {
    label: "contrast",
    exportValue: row => row.contrast,
  },
  {
    label: "study overview",
    exportValue: row => row.studyOverview,
  },
  {
    label: "cell type",
    exportValue: row => row.cellType,
  },
  {
    label: "cell line background",
    exportValue: row => row.cellLineBackground,
  },
  {
    label: "CRISPR screen library",
    exportValue: row => row.crisprScreenLibrary,
  },
  {
    label: "resource score",
    exportValue: row => row.resourceScore,
  },
  {
    label: "statistical test tail",
    exportValue: row => row.statisticalTestTail,
  },
];

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;
  const variables = {
    ensemblId: ensgId,
    efoId,
    size: sectionsBaseSizeQuery,
  };
  const request = useQuery(CRISPR_QUERY, {
    variables,
  });
  const classes = useStyles();

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.ot_partner}
      request={request}
      entity={entity}
      renderDescription={data => (
        <Description symbol={label.symbol} name={label.name} data={data} />
      )}
      renderBody={({ disease }) => {
        const { rows } = disease.OtCrisprSummary;
        return (
          <OtTable
            columns={getColumns(classes)}
            rows={rows}
            dataDownloader
            dataDownloaderColumns={exportColumns}
            dataDownloaderFileStem={`${ensgId}-${efoId}-otcrispr`}
            showGlobalFilter
            sortBy="resourceScore"
            fixed
            noWrap={false}
            noWrapHeader={false}
            rowsPerPageOptions={defaultRowsPerPageOptions}
            query={CRISPR_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
