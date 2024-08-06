import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import {
  Link,
  Tooltip,
  SectionItem,
  PublicationsDrawer,
  DirectionOfEffectIcon,
  DirectionOfEffectTooltip,
  OtTable,
} from "ui";

import { definition } from ".";
import { defaultRowsPerPageOptions, naLabel, sectionsBaseSizeQuery } from "../../constants";
import { epmcUrl } from "../../utils/urls";
import Description from "./Description";
import { dataTypesMap } from "../../dataTypes";
import { sentenceCase } from "../../utils/global";

import ORPHANET_QUERY from "./OrphanetQuery.gql";

const getColumns = label => [
  {
    id: "disease.name",
    label: "Disease/phenotype",
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
        <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
      </Tooltip>
    ),
    filterValue: ({ disease, diseaseFromSource }) =>
      `${disease.name} ${disease.id} ${diseaseFromSource}`,
  },
  {
    id: "targetFromSourceId",
    label: "Reported protein",
    renderCell: ({ targetFromSource, targetFromSourceId }) => (
      <Link to={`/target/${targetFromSourceId}`}>{targetFromSource}</Link>
    ),
    filterValue: ({ targetFromSource, targetFromSourceId }) =>
      `${targetFromSource} ${targetFromSourceId}`,
  },
  {
    id: "variantFunctionalConsequence",
    label: "Functional consequence",
    renderCell: ({ variantFunctionalConsequence }) =>
      variantFunctionalConsequence ? (
        <Link
          external
          to={`http://www.sequenceontology.org/browser/current_svn/term/${variantFunctionalConsequence.id}`}
        >
          {sentenceCase(variantFunctionalConsequence.label)}
        </Link>
      ) : (
        naLabel
      ),
    filterValue: ({ variantFunctionalConsequence }) =>
      sentenceCase(variantFunctionalConsequence?.label),
  },
  {
    id: "directionOfVariantEffect",
    label: (
      <DirectionOfEffectTooltip docsUrl="https://platform-docs.opentargets.org/evidence#orphanet"></DirectionOfEffectTooltip>
    ),
    renderCell: ({ variantEffect, directionOnTrait }) => {
      return (
        <DirectionOfEffectIcon variantEffect={variantEffect} directionOnTrait={directionOnTrait} />
      );
    },
  },
  {
    id: "alleleOrigins",
    label: "Allele origin",
    renderCell: ({ alleleOrigins }) => alleleOrigins.join("; "),
    filterValue: ({ alleleOrigins }) => alleleOrigins.join("; "),
  },
  {
    id: "confidence",
    label: "Confidence",
    renderCell: ({ confidence }) => confidence,
  },
  {
    id: "literature",
    label: "Literature",
    renderCell: ({ literature }) => {
      const literatureList =
        literature?.reduce((acc, id) => {
          if (id !== "NA") {
            acc.push({
              name: id,
              url: epmcUrl(id),
              group: "literature",
            });
          }
          return acc;
        }, []) || [];

      return (
        <PublicationsDrawer entries={literatureList} symbol={label.symbol} name={label.name} />
      );
    },
  },
];

const exportColumns = [
  {
    label: "Disease",
    exportValue: row => row.disease.name,
  },
  {
    label: "Disease ID",
    exportValue: row => row.disease.id,
  },
  {
    label: "Disease from source",
    exportValue: row => row.diseaseFromSource,
  },
  {
    label: "Target from source",
    exportValue: row => row.targetFromSource,
  },
  {
    label: "Target from source ID",
    exportValue: row => row.targetFromSourceId,
  },
  {
    label: "Allele origins",
    exportValue: row => row.alleleOrigins.join("; "),
  },
  {
    label: "Functional consequence",
    exportValue: row => sentenceCase(row.variantFunctionalConsequence.label),
  },
  {
    label: "Functional consequence ID",
    exportValue: row => row.variantFunctionalConsequence.id,
  },
  {
    label: "Confidence",
    exportValue: row => row.confidence,
  },
  {
    label: "Publication IDs",
    exportValue: row => row.literature.join(", "),
  },
];

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
    size: sectionsBaseSizeQuery,
  };

  const request = useQuery(ORPHANET_QUERY, {
    variables,
  });

  const columns = getColumns(label);

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.genetic_association}
      request={request}
      entity={entity}
      renderDescription={() => <Description symbol={label.symbol} diseaseName={label.name} />}
      renderBody={({ disease }) => {
        const { rows } = disease.orphanetSummary;
        return (
          <OtTable
            columns={columns}
            rows={rows}
            dataDownloader
            dataDownloaderFileStem={`orphanet-${ensgId}-${efoId}`}
            dataDownloaderColumns={exportColumns}
            showGlobalFilter
            rowsPerPageOptions={defaultRowsPerPageOptions}
            query={ORPHANET_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
