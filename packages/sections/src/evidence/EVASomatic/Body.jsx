import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  SectionItem,
  ChipList,
  Tooltip,
  Link,
  PublicationsDrawer,
  ClinvarStars,
  DirectionOfEffectIcon,
  DirectionOfEffectTooltip,
  OtTableSSP,
} from "ui";

import { sentenceCase } from "../../utils/global";

import { epmcUrl } from "../../utils/urls";
import { clinvarStarMap, naLabel } from "../../constants";
import Description from "./Description";
import { dataTypesMap } from "../../dataTypes";
import EVA_SOMATIC_QUERY from "./EvaSomaticQuery.gql";
import { definition } from ".";

const getColumns = label => [
  {
    id: "disease.name",
    label: "Disease/phenotype",
    renderCell: ({ disease, diseaseFromSource, cohortPhenotypes }) => (
      <Tooltip
        title={
          <>
            <Typography variant="subtitle2" display="block" align="center">
              Reported disease or phenotype:
            </Typography>
            <Typography variant="caption" display="block" align="center" gutterBottom>
              {diseaseFromSource}
            </Typography>

            {cohortPhenotypes?.length > 1 ? (
              <>
                <Typography variant="subtitle2" display="block" align="center">
                  All reported phenotypes:
                </Typography>
                <Typography variant="caption" display="block">
                  {cohortPhenotypes.map(cp => (
                    <div key={cp}>{cp}</div>
                  ))}
                </Typography>
              </>
            ) : (
              ""
            )}
          </>
        }
        showHelpIcon
      >
        <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
      </Tooltip>
    ),
  },
  {
    id: "variantId",
    label: "Variant",
    enableHiding: false,
    renderCell: ({ variant: { id: variantId } }) =>
      variantId ? (
        <>
          {variantId.substring(0, 20)}
          {variantId.length > 20 ? "\u2026" : ""}
        </>
      ) : (
        naLabel
      ),
    filterValue: ({ variant: { id: variantId } }) => `${variantId}`,
  },
  {
    id: "variantRsId",
    label: "rsID",
    renderCell: ({ variantRsId }) =>
      variantRsId ? (
        <Link
          external
          to={`http://www.ensembl.org/Homo_sapiens/Variation/Explore?v=${variantRsId}`}
        >
          {variantRsId}
        </Link>
      ) : (
        naLabel
      ),
    filterValue: ({ variantRsId }) => `${variantRsId}`,
  },
  {
    id: "variantHgvsId",
    label: "HGVS ID",
    renderCell: ({ variant }) => variant.hgvsId || naLabel,
    filterValue: ({ variant }) => `${variant.hgvsId}`,
  },
  {
    id: "studyId",
    label: "ClinVar ID",
    renderCell: ({ studyId }) => (
      <Link external to={`https://identifiers.org/clinvar.record/${studyId}`}>
        {studyId}
      </Link>
    ),
  },
  {
    id: "clinicalSignificances",
    label: "Clinical significance",
    renderCell: ({ clinicalSignificances }) => {
      if (!clinicalSignificances) return naLabel;

      if (clinicalSignificances.length === 1) return sentenceCase(clinicalSignificances[0]);

      if (clinicalSignificances.length > 1)
        return (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {clinicalSignificances.map(clinicalSignificance => (
              <li key={clinicalSignificance}>{sentenceCase(clinicalSignificance)}</li>
            ))}
          </ul>
        );

      return naLabel;
    },
    filterValue: ({ clinicalSignificances }) => clinicalSignificances.join(),
  },
  {
    id: "directionOfVariantEffect",
    label: (
      <DirectionOfEffectTooltip docsUrl="https://platform-docs.opentargets.org/evidence#clinvar-somatic"></DirectionOfEffectTooltip>
    ),
    renderCell: ({ variantEffect, directionOnTrait }) => {
      return (
        <DirectionOfEffectIcon variantEffect={variantEffect} directionOnTrait={directionOnTrait} />
      );
    },
  },
  {
    id: "allelicRequirements",
    label: "Allele origin",
    renderCell: ({ alleleOrigins, allelicRequirements }) => {
      if (!alleleOrigins || alleleOrigins.length === 0) return naLabel;

      if (allelicRequirements)
        return (
          <Tooltip
            title={
              <>
                <Typography variant="subtitle2" display="block" align="center">
                  Allelic requirements:
                </Typography>
                {allelicRequirements.map(r => (
                  <Typography variant="caption" key={r}>
                    {r}
                  </Typography>
                ))}
              </>
            }
            showHelpIcon
          >
            {alleleOrigins.map(a => sentenceCase(a)).join("; ")}
          </Tooltip>
        );

      return alleleOrigins.map(a => sentenceCase(a)).join("; ");
    },
    filterValue: ({ alleleOrigins }) => (alleleOrigins ? alleleOrigins.join() : ""),
  },
  {
    label: "Review status",
    renderCell: ({ confidence }) => (
      <Tooltip title={confidence}>
        <span>
          <ClinvarStars num={clinvarStarMap[confidence]} />
        </span>
      </Tooltip>
    ),
  },
  {
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
    label: "diseaseId",
    exportValue: row => row.disease.id,
  },
  {
    label: "diseaseName",
    exportValue: row => row.disease.name,
  },
  {
    label: "variantId",
    exportValue: row => row.variantId,
  },
  {
    label: "variantRsId",
    exportValue: row => row.variantRsId,
  },
  {
    label: "variantHgvsId",
    exportValue: row => row.variantHgvsId,
  },
  {
    label: "clinicalSignificances",
    exportValue: row => row.clinicalSignificances,
  },
  {
    label: "allelicRequirements",
    exportValue: row => row.allelicRequirements,
  },
  {
    label: "reviewStatus",
    exportValue: row => row.confidence,
  },

  {
    label: "literature",
    exportValue: row => row.literature,
  },
];

const useStyles = makeStyles({
  roleInCancerBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: "2rem",
  },
  roleInCancerTitle: { marginRight: ".5rem !important" },
});

function Body({ id, label, entity }) {
  const classes = useStyles();

  const { ensgId: ensemblId, efoId } = id;
  const [request, setRequest] = useState({ loading: true, data: null, error: false });

  const columns = getColumns(label);

  function getRoleInCancer() {
    if (!request.data) return null;

    const { hallmarks } = request.data?.target;
    let roleInCancerItems = [{ label: "Unknown" }];
    if (hallmarks && hallmarks.attributes.length > 0) {
      roleInCancerItems = hallmarks.attributes
        .filter(attribute => attribute.name === "role in cancer")
        .map(attribute => ({
          label: attribute.description,
          url: epmcUrl(attribute.pmid),
        }));
    }

    return (
      <>
        <Typography className={classes.roleInCancerTitle}>
          <b>{label.symbol}</b> role in cancer:
        </Typography>
        <ChipList items={roleInCancerItems} />
      </>
    );
  }

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.somatic_mutation}
      request={request}
      entity={entity}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={() => (
        <>
          <Box className={classes.roleInCancerBox}>{getRoleInCancer()}</Box>

          <OtTableSSP
            query={EVA_SOMATIC_QUERY}
            columns={columns}
            dataDownloader
            dataDownloaderColumns={exportColumns}
            dataDownloaderFileStem="eva_somatic-evidence"
            entity={entity}
            sectionName="eva_somatic"
            showGlobalFilter={false}
            setInitialRequestData={req => {
              setRequest(req);
            }}
            variables={{
              ensemblId,
              efoId,
            }}
          />
        </>
      )}
    />
  );
}

export default Body;
