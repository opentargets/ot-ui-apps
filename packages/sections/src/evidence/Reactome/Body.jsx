import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import {
  Link,
  SectionItem,
  Tooltip,
  PublicationsDrawer,
  EllsWrapper,
  DataTable,
  TableDrawer,
} from "ui";

import { definition } from ".";
import Description from "./Description";
import { epmcUrl } from "../../utils/urls";
import { dataTypesMap } from "../../dataTypes";
import REACTOME_QUERY from "./sectionQuery.gql";
import { sentenceCase } from "../../utils/global";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";

const getColumns = (label) => [
  {
    id: "disease.name",
    label: "Disease / phenotype",
    renderCell: ({ disease, diseaseFromSource }) => (
      <Tooltip
        title={
          <>
            <Typography variant="subtitle2" display="block" align="center">
              Reported disease or phenotype:
            </Typography>
            <Typography variant="caption" display="block" align="center">
              {diseaseFromSource}
            </Typography>
          </>
        }
        showHelpIcon
      >
        <Link to={`/disease/${disease.id}`}>
          <EllsWrapper>{disease.name}</EllsWrapper>
        </Link>
      </Tooltip>
    ),
    width: "18%",
  },
  {
    id: "pathwayName",
    label: "Pathway",
    renderCell: ({ pathways }) => {
      if (!pathways || pathways.length === 0) {
        return naLabel;
      }
      if (pathways.length === 1) {
        return (
          <Link
            external
            to={`http://www.reactome.org/PathwayBrowser/#${pathways[0].id}`}
          >
            <EllsWrapper>{pathways[0].name}</EllsWrapper>
          </Link>
        );
      }
      const refs = pathways.map((p) => ({
        url: `http://www.reactome.org/PathwayBrowser/#${p.id}`,
        name: p.name,
        group: "Pathways",
      }));
      return <TableDrawer entries={refs} message={`${refs.length} pathways`} />;
    },
    width: "17%",
  },
  {
    id: "reactionId",
    label: "Reaction",
    renderCell: ({ reactionName, reactionId }) => (
      <Link external to={`https://identifiers.org/reactome/${reactionId}`}>
        <EllsWrapper>{reactionName}</EllsWrapper>
      </Link>
    ),
    width: "17%",
  },
  {
    id: "targetFromSourceId",
    label: "Reported target",
    renderCell: ({ targetFromSourceId }) => (
      <Link
        external
        to={`https://identifiers.org/uniprot/${targetFromSourceId}`}
      >
        <EllsWrapper>{targetFromSourceId}</EllsWrapper>
      </Link>
    ),
    width: "12%",
  },
  {
    id: "targetModulation",
    label: "Target modulation",
    renderCell: ({ targetModulation }) =>
      targetModulation ? (
        <EllsWrapper>{sentenceCase(targetModulation)}</EllsWrapper>
      ) : (
        naLabel
      ),
    filterValue: ({ targetModulation }) => sentenceCase(targetModulation),
    width: "12%",
  },
  {
    filterValue: ({ variantAminoacidDescriptions }) =>
      variantAminoacidDescriptions
        .map((variantAminoacidDescription) => variantAminoacidDescription)
        .join(),
    label: "Amino acid variation",
    renderCell: ({ variantAminoacidDescriptions }) => {
      if (variantAminoacidDescriptions?.length === 1) {
        return <EllsWrapper>{variantAminoacidDescriptions[0]}</EllsWrapper>;
      }
      if (variantAminoacidDescriptions?.length > 1) {
        return (
          <TableDrawer
            entries={variantAminoacidDescriptions.map((d) => ({
              name: d,
              group: "Amino acid variation",
            }))}
          />
        );
      }
      return naLabel;
    },
    width: "12%",
  },
  {
    id: "literature",
    label: "Literature",
    renderCell: ({ literature = [] }) => {
      const literatureList = [];
      literature?.forEach((id) => {
        if (id !== "NA") {
          literatureList.push({
            name: id,
            url: epmcUrl(id),
            group: "literature",
          });
        }
      });
      return (
        <PublicationsDrawer
          entries={literatureList}
          symbol={label.symbol}
          name={label.name}
        />
      );
    },
    width: "12%",
  },
];

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
  };

  const request = useQuery(REACTOME_QUERY, {
    variables,
  });

  const columns = getColumns(label);

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.affected_pathway}
      request={request}
      entity={entity}
      renderDescription={() => (
        <Description symbol={label.symbol} name={label.name} />
      )}
      renderBody={({ disease }) => {
        const { rows } = disease.reactomeSummary;
        return (
          <DataTable
            columns={columns}
            rows={rows}
            dataDownloader
            showGlobalFilter
            rowsPerPageOptions={defaultRowsPerPageOptions}
            fixed
            noWrapHeader={false}
            query={REACTOME_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
