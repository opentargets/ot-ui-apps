import { useQuery } from "@apollo/client";
import { Typography, Chip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { SectionItem, Link } from "ui";

import {
  defaultRowsPerPageOptions,
  naLabel,
  studySourceMap,
} from "../../constants";
import { definition } from ".";
import Summary from "./Summary";
import Description from "./Description";
import { dataTypesMap } from "../../dataTypes";
import { DataTable } from "../../components/Table";
import OPEN_TARGETS_GENETICS_QUERY from "./sectionQuery.gql";
import { otgStudyUrl, otgVariantUrl } from "../../utils/urls";
import ScientificNotation from "../../components/ScientificNotation";
import { identifiersOrgLink, sentenceCase } from "../../utils/global";
import { PublicationsDrawer } from "../../components/PublicationsDrawer";

const useStyles = makeStyles({
  xsmall: {
    fontSize: "0.7rem",
  },
  chipLink: {
    marginLeft: "5px",
  },
});

function getColumns(classes) {
  return [
    {
      id: "disease",
      label: "Disease/phenotype",
      renderCell: ({ disease }) => (
        <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
      ),
      filterValue: ({ disease }) => disease.name,
    },
    {
      id: "diseaseFromSource",
      label: "Reported disease/phenotype",
      renderCell: ({ diseaseFromSource, studyId }) => {
        const parsedDiseaseFromSource = diseaseFromSource.replace(/['"]+/g, "");
        return (
          <Link external to={otgStudyUrl(studyId)}>
            {diseaseFromSource ? parsedDiseaseFromSource : studyId}
          </Link>
        );
      },
    },
    {
      id: "literature",
      label: "Publication",
      renderCell: ({ literature, publicationYear, publicationFirstAuthor }) => {
        if (!literature) return naLabel;
        return (
          <PublicationsDrawer
            entries={[{ name: literature[0] }]}
            customLabel={`${publicationFirstAuthor} et al, ${publicationYear}`}
          />
        );
      },
      filterValue: ({ literature, publicationYear, publicationFirstAuthor }) =>
        `${literature} ${publicationYear} ${publicationFirstAuthor}`,
    },
    {
      id: "studySource",
      label: "Study source",
      renderCell: ({ projectId }) => {
        if (!projectId) return naLabel;
        if (Object.keys(studySourceMap).indexOf(projectId) < 0) return naLabel;
        return studySourceMap[projectId];
      },
    },
    {
      id: "variantId",
      label: "Variant ID (RSID)",
      renderCell: ({ variantId, variantRsId }) => (
        <>
          {variantId ? (
            <Link external to={otgVariantUrl(variantId)}>
              {variantId}
            </Link>
          ) : (
            naLabel
          )}
          {variantRsId ? (
            <Typography variant="caption">
              {" "}
              (
              <Link
                external
                to={`http://www.ensembl.org/Homo_sapiens/Variation/Explore?v=${variantRsId}`}
              >
                {variantRsId}
              </Link>
              )
            </Typography>
          ) : null}
        </>
      ),
      filterValue: ({ variantId, variantRsId }) =>
        `${variantId} ${variantRsId}`,
    },
    {
      id: "variantFunctionalConsequenceId",
      label: "Functional Consequence",
      renderCell: ({ variantFunctionalConsequence, variantId }) => {
        const pvparams = variantId?.split("_") || [];
        return variantFunctionalConsequence ? (
          <>
            <Link
              external
              to={identifiersOrgLink(
                "SO",
                variantFunctionalConsequence.id.slice(3)
              )}
            >
              <Chip
                label={sentenceCase(variantFunctionalConsequence.label)}
                size="small"
                color="primary"
                clickable
                variant="outlined"
                className={classes.xsmall}
              />
            </Link>

            {
              // add linkout to ProtVar for specific functional consequence values:
              // "missense variant", "stop gained"
              (variantFunctionalConsequence.id === "SO:0001583" ||
                variantFunctionalConsequence.id === "SO:0001587") &&
              pvparams.length == 4 ? (
                <Link
                  external
                  to={`https://www.ebi.ac.uk/ProtVar/query?chromosome=${pvparams[0]}&genomic_position=${pvparams[1]}&reference_allele=${pvparams[2]}&alternative_allele=${pvparams[3]}`}
                  className={classes.chipLink}
                >
                  <Chip
                    label="ProtVar"
                    size="small"
                    color="primary"
                    clickable
                    variant="outlined"
                    className={classes.xsmall}
                  />
                </Link>
              ) : null
            }
          </>
        ) : (
          naLabel
        );
      },
      filterValue: ({ variantFunctionalConsequence }) =>
        `${sentenceCase(variantFunctionalConsequence.label)} ${
          variantFunctionalConsequence.id
        }`,
    },
    {
      id: "variantFunctionalConsequenceFromQtlId",
      label: "QTL effect",
      tooltip:
        "The direction is inferred from the strongest effect across all the co-localising QTLs",
      renderCell: ({ variantFunctionalConsequenceFromQtlId }) =>
        variantFunctionalConsequenceFromQtlId ? (
          <Link
            external
            to={identifiersOrgLink(
              "SO",
              variantFunctionalConsequenceFromQtlId.id.slice(3)
            )}
          >
            <Chip
              label={sentenceCase(variantFunctionalConsequenceFromQtlId.label)}
              size="small"
              color="primary"
              clickable
              variant="outlined"
              className={classes.xsmall}
            />
          </Link>
        ) : (
          ""
        ),
      filterValue: ({ variantFunctionalConsequenceFromQtlId }) =>
        variantFunctionalConsequenceFromQtlId
          ? `${sentenceCase(variantFunctionalConsequenceFromQtlId.label)} ${
              variantFunctionalConsequenceFromQtlId.id
            }`
          : naLabel,
    },
    {
      id: "pValueMantissa",
      label: (
        <>
          Association <i>p</i>-value
        </>
      ),
      numeric: true,
      sortable: true,
      renderCell: ({ pValueMantissa, pValueExponent }) => (
        <ScientificNotation number={[pValueMantissa, pValueExponent]} />
      ),
      comparator: (a, b) =>
        a.pValueMantissa * 10 ** a.pValueExponent -
        b.pValueMantissa * 10 ** b.pValueExponent,
    },
    {
      id: "studySampleSize",
      label: "Sample size",
      numeric: true,
      sortable: true,
      renderCell: ({ studySampleSize }) =>
        studySampleSize
          ? parseInt(studySampleSize, 10).toLocaleString()
          : naLabel,
    },
    {
      id: "oddsRatio",
      label: "Odds Ratio (CI 95%)",
      numeric: true,
      renderCell: ({
        oddsRatio,
        oddsRatioConfidenceIntervalLower,
        oddsRatioConfidenceIntervalUpper,
      }) => {
        const ci =
          oddsRatioConfidenceIntervalLower && oddsRatioConfidenceIntervalUpper
            ? `(${parseFloat(
                oddsRatioConfidenceIntervalLower.toFixed(3)
              )}, ${parseFloat(oddsRatioConfidenceIntervalUpper.toFixed(3))})`
            : "";
        return oddsRatio
          ? `${parseFloat(oddsRatio.toFixed(3))} ${ci}`
          : naLabel;
      },
    },
    {
      id: "betaConfidenceInterval",
      label: "Beta (CI 95%)",
      numeric: true,
      renderCell: ({
        beta,
        betaConfidenceIntervalLower,
        betaConfidenceIntervalUpper,
      }) => {
        const ci =
          betaConfidenceIntervalLower && betaConfidenceIntervalUpper
            ? `(${parseFloat(
                betaConfidenceIntervalLower.toFixed(3)
              )}, ${parseFloat(betaConfidenceIntervalUpper.toFixed(3))})`
            : "";
        return beta ? `${parseFloat(beta.toFixed(3))} ${ci}` : naLabel;
      },
    },
    {
      id: "resourceScore",
      label: "L2G score",
      tooltip: (
        <>
          Causal inference score - see{" "}
          <Link
            external
            to="https://platform-docs.opentargets.org/evidence#open-targets-genetics-portal"
          >
            our documentation
          </Link>{" "}
          for more information.
        </>
      ),
      numeric: true,
      sortable: true,
      renderCell: ({ resourceScore }) => parseFloat(resourceScore.toFixed(5)),
    },
  ];
}

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;
  const variables = { ensemblId: ensgId, efoId };
  const classes = useStyles();
  const columns = getColumns(classes);

  const request = useQuery(OPEN_TARGETS_GENETICS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.genetic_association}
      request={request}
      entity={entity}
      renderDescription={() => (
        <Description symbol={label.symbol} name={label.name} />
      )}
      renderBody={(data) => (
        <DataTable
          columns={columns}
          dataDownloader
          dataDownloaderFileStem={`otgenetics-${ensgId}-${efoId}`}
          order="desc"
          rows={data.disease.openTargetsGenetics.rows}
          pageSize={10}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          showGlobalFilter
          sortBy="resourceScore"
          query={OPEN_TARGETS_GENETICS_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
