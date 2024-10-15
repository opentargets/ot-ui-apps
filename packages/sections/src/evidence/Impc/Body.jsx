import { Typography } from "@mui/material";
import { useState } from "react";

import {
  Link,
  SectionItem,
  Tooltip,
  TableDrawer,
  MouseModelAllelicComposition,
  DirectionOfEffectIcon,
  DirectionOfEffectTooltip,
  OtTableSSP,
} from "ui";

import client from "../../client";
import { definition } from ".";
import Description from "./Description";
import INTOGEN_QUERY from "./sectionQuery.gql";
import IMCPSummaryFragment from "./IMCPSummaryFragment.gql";
import { dataTypesMap } from "../../dataTypes";
import { sentenceCase } from "../../utils/global";
import { naLabel } from "../../constants";

const columns = [
  {
    id: "disease",
    label: "Disease/phenotype",
    renderCell: ({ disease, diseaseFromSource }) => (
      <Tooltip
        title={
          <>
            <Typography variant="subtitle2" display="block" align="center">
              Reported disease or phenotype:
            </Typography>
            <Typography variant="caption" display="block" align="center">
              {sentenceCase(diseaseFromSource)}
            </Typography>
          </>
        }
        showHelpIcon
      >
        <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
      </Tooltip>
    ),
    filterValue: ({ disease, diseaseFromSource }) => [disease.name, diseaseFromSource].join(),
  },
  {
    id: "diseaseModelAssociatedHumanPhenotypes",
    label: "Human phenotypes",
    renderCell: ({ diseaseModelAssociatedHumanPhenotypes: humanPhenotypes }) => {
      const entries = humanPhenotypes
        ? humanPhenotypes.map(entry => ({
            name: entry.label,
            group: "Human phenotypes",
          }))
        : [];
      return (
        <TableDrawer
          entries={entries}
          showSingle={false}
          message={`${humanPhenotypes ? humanPhenotypes.length : 0} phenotype${
            humanPhenotypes === null || humanPhenotypes.length !== 1 ? "s" : ""
          }`}
        />
      );
    },
    filterValue: ({ diseaseModelAssociatedHumanPhenotypes = [] }) =>
      diseaseModelAssociatedHumanPhenotypes?.map(dmahp => dmahp.label).join(),
  },
  {
    id: "diseaseModelAssociatedModelPhenotypes",
    label: "Mouse phenotypes",

    renderCell: ({ diseaseModelAssociatedModelPhenotypes: mousePhenotypes }) => (
      <TableDrawer
        entries={mousePhenotypes.map(entry => ({
          name: entry.label,
          group: "Mouse phenotypes",
        }))}
        showSingle={false}
        message={`${mousePhenotypes.length} phenotype${mousePhenotypes.length !== 1 ? "s" : ""}`}
      />
    ),
    filterValue: ({ diseaseModelAssociatedModelPhenotypes = [] }) =>
      diseaseModelAssociatedModelPhenotypes.map(dmamp => dmamp.label).join(),
  },
  {
    id: "directionOfVariantEffect",
    label: (
      <DirectionOfEffectTooltip docsUrl="https://platform-docs.opentargets.org/evidence#impc"></DirectionOfEffectTooltip>
    ),
    renderCell: ({ variantEffect, directionOnTrait }) => {
      return (
        <DirectionOfEffectIcon variantEffect={variantEffect} directionOnTrait={directionOnTrait} />
      );
    },
  },
  {
    id: "literature",
    label: "Mouse model allelic composition",
    renderCell: ({
      biologicalModelAllelicComposition,
      biologicalModelGeneticBackground,
      biologicalModelId,
    }) => {
      if (
        biologicalModelAllelicComposition &&
        biologicalModelGeneticBackground &&
        biologicalModelId
      ) {
        return (
          <Link external to={`https://identifiers.org/${biologicalModelId}`}>
            <MouseModelAllelicComposition
              allelicComposition={biologicalModelAllelicComposition}
              geneticBackground={biologicalModelGeneticBackground}
            />
          </Link>
        );
      }
      if (biologicalModelAllelicComposition && biologicalModelGeneticBackground) {
        return (
          <MouseModelAllelicComposition
            allelicComposition={biologicalModelAllelicComposition}
            geneticBackground={biologicalModelGeneticBackground}
          />
        );
      }

      return naLabel;
    },
  },
];

const exportColumns = [
  {
    label: "diseaseId",
    exportValue: row => row.disease.id,
  },
  {
    label: "diseaseName",
    exportValue: row => row.disease.name,
  },
  {
    label: "diseaseModelAssociatedHumanPhenotypes",
    exportValue: row => row.diseaseModelAssociatedHumanPhenotypes,
  },
  {
    label: "diseaseModelAssociatedModelPhenotypes",
    exportValue: row => row.diseaseModelAssociatedModelPhenotypes,
  },
  {
    label: "literature",
    exportValue: row => row.biologicalModelId,
  },
];

function fetchData({ ensemblId }) {
  return client.query({
    query: IMCPSummaryFragment,
    variables: {
      ensgId: ensemblId,
    },
  });
}

function Body({ id, label, entity }) {
  const { ensgId: ensemblId, efoId } = id;
  const [initialLoading, setInitialLoading] = useState(true);
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   let isCurrent = true;

  //   fetchData({ ensemblId }).then(res => {
  //     const { count: newCount } = res.data.disease.impc;
  //     if (isCurrent) {
  //       setInitialLoading(false);
  //       setCount(newCount);
  //     }
  //   });

  //   return () => {
  //     isCurrent = false;
  //   };
  // }, []);

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.animal_model}
      // TODO: fragment call
      request={{
        loading: false,
        data: { [entity]: { impc: { count: 10 } } },
      }}
      entity={entity}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={() => (
        <OtTableSSP
          query={INTOGEN_QUERY}
          columns={columns}
          dataDownloader
          dataDownloaderColumns={exportColumns}
          dataDownloaderFileStem="impc-evidence"
          entity={entity}
          sectionName="impc"
          showGlobalFilter={false}
          variables={{
            ensemblId,
            efoId,
          }}
        />
      )}
    />
  );
}

export default Body;
