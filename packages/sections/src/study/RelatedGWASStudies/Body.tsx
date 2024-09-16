import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import { Link, SectionItem, DataTable, Tooltip } from "ui";
import { definition } from "../VariantEffectPredictor";
import Description from "../VariantEffectPredictor/Description";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";
import VARIANT_EFFECT_PREDICTOR_QUERY from "./VariantEffectPredictorQuery.gql";

function formatSamples(samples: any[]) {  // wait until get types directly from schema
  return samples
    .map(({ ancestry, sampleSize }) => `${ancestry}: ${sampleSize}`)
    .join(", ");
}

function getColumns(studyCategory) {
  return [
    {
      id: "studyId",
      label: "Study ID",
    },
    {
      id: "author",
      label: "Author",
      renderCell: ({ publicationFirstAuthor }) => (
        studyCategory === "FINNGEN"
          ? "FINNGEN_R10"
          : publicationFirstAuthor || naLabel
      ),
      exportValue: ({ publicationFirstAuthor }) => (
        studyCategory === "FINNGEN" ? "FINNGEN_R10" : publicationFirstAuthor 
      ),
    },
    {
      id: "publicationYear",
      label: "Publication date",
      renderCell: ({ publicationYear }) => (
        studyCategory === "FINNGEN"
          ? "2023"
          : publicationYear || naLabel
      ),
      exportValue: ({ publicationYear }) => (
        studyCategory === "FINNGEN" ? "2023" : publicationYear 
      ),
    },
    {
      id: "publicationJournal",
      label: "Journal",
      renderCell: ({ publicationJournal }) => (
        studyCategory === "FINNGEN"
          ? naLabel
          : publicationJournal 
      ),
      exportValue: ({ publicationJournal }) => (
        studyCategory === "FINNGEN" ? naLabel : publicationJournal 
      ),
    },
    {
      id: "nSamples",
      label: "N study",
    },
    {
      id: "initialSampleSize",
      label: "N discovery",
      renderCell: ({ initialSampleSize, discoverySamples }) => (
        studyCategory === "GWAS"
          ? initialSampleSize || naLabel
          : discoverySamples?.length
            ? (initialSampleSize
                ? <Tooltip
                    title={
                      <Typography variant="caption">
                        Initial sample size: {initialSampleSize}
                      </Typography>
                    }
                  >
                    {formatSamples(discoverySamples)}
                  </Tooltip>
                : formatSamples(discoverySamples)
              )
            : naLabel
      ),
      exportValue: ({ initialSampleSize, discoverySamples }) => (
        studyCategory === "GWAS"
          ? initialSampleSize
          : discoverySamples?.length
            ? formatSamples(discoverySamples)
            : null
      )
    },
    {
      id: "replicationSamples",
      label: "N replication",
      renderCell: ({ replicationSamples }) => (
        studyCategory === "FINNGEN"
          ? naLabel
          : replicationSamples?.length
            ? formatSamples(replicationSamples)
            : naLabel
      ),
      exportValue:({ replicationSamples }) => (
        studyCategory === "FINNGEN"
          ? null
          : replicationSamples
      ),
    },
    {
      id: "nCases",
      label: "N Cases",
    },
    {
      id: "nControls",
      label: "N Controls",
    },
    {
      id: "cohorts",
      label: "Cohorts",
      renderCell: ({ cohorts, ldPopulationStructure }) => {
        let displayText;
        if (studyCategory === "FINNGEN") displayText = "FinnGen";
        else if (cohorts?.length) displayText = cohorts.join(", ");
        else return naLabel;
        return ldPopulationStructure?.length
          ? <Tooltip
              title={
                <>
                  <Typography variant="subtitle2" display="block" align="center">
                    LD populations and relative sample sizes
                  </Typography>
                  {ldPopulationStructure.map(({ ldPopulation, relativeSampleSize }) => (
                    <Box key={ldPopulation}>
                      <Typography variant="caption">
                        {ldPopulation}: {relativeSampleSize}
                      </Typography>
                    </Box>
                  ))}
                </>
              }
              showHelpIcon
            >
             displayText
            </Tooltip>
          : displayText;
      },
      exportValue: ({ cohorts }) => (
        studyCategory === "FINNGEN"
          ? "FinnGen"
          : cohorts?.length ? cohorts.join(", ") : null
      )
    },
    {
      id: "hasSumstats",
      label: "Has Sumstats",
      renderCell: ({ hasSumstats }) => (
        studyCategory === "FINNGEN"
          ? "yes"
          : hasSumstats
            ? "yes"
            : "no"
      ),
      exportValue: ({ hasSumstats }) => (
        studyCategory === "FINNGEN"
          ? "yes"
          : hasSumstats
            ? "yes"
            : "no"
      ),
    },
    {
      id: "pubmedId",
      label: "PubMed ID",
      renderCell: ({ pubmedId }) => (
        studyCategory === "GWAS" && pubmedId 
          ? <Link external to={`https://europepmc.org/article/med/${pubmedId}`}>
              {pubmedId}
            </Link>
          : naLabel
      ),
      exportValue: ({ pubmedId }) => (
        studyCategory === "GWAS" && pubmedId 
          ? pubmedId
          : naLabel
      ),
    },
  ];
}

type BodyProps = {
  studyId: string,
  entity: string,
};

// !!!!!!!!!!!!!!!! HERE !!!!!!!!!!!!!
// NEED TO GET THE STUDY CATEGORY FROM THE PROJECT ID:
// - get project id in query
// - extract getStiudyId from study page to function

export function Body({ studyId, studyCategory, entity }: BodyProps) {

  const variables = {
    variantId: id,
  };

  const request = useQuery(VARIANT_EFFECT_PREDICTOR_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={({ variant }) => (
        <Description
          variantId={variant.id}
          referenceAllele={variant.referenceAllele}
          alternateAllele={variant.alternateAllele}
        />
      )}
      renderBody={({ variant }) => {
        return (
          <DataTable
            columns={columns}
            rows={variant.transcriptConsequences}  // FILTER OUT REPEATS AND SELF
            dataDownloader
            rowsPerPageOptions={defaultRowsPerPageOptions}
            query={VARIANT_EFFECT_PREDICTOR_QUERY.loc.source.body}
            variables={variables}
            sortBy="target.approvedSymbol"
          />
        );
      }}
    />
  );
}

export default Body;