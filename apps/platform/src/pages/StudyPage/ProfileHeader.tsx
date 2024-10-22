import {
  usePlatformApi,
  Link,
  Field,
  ProfileHeader as BaseProfileHeader,
  Tooltip,
} from "ui";
import { Typography, Box } from "@mui/material";

import STUDY_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";

type samplesType = {
  ancestry: string;
  sampleSize: number;
}[];

function formatSamples(samples: samplesType) {
  return samples
    .map(({ ancestry, sampleSize }) => `${ancestry}: ${sampleSize}`)
    .join(", ");
}

type ProfileHeaderProps = {
  studyCategory: string;
};

function ProfileHeader({ studyCategory }: ProfileHeaderProps) {
  const { loading, error, data } = usePlatformApi();

  // TODO: Errors!
  if (error) return null;

  const {
    publicationFirstAuthor,
    publicationDate,
    publicationJournal,
    pubmedId,
    nSamples,
    initialSampleSize,
    replicationSamples,
    traitFromSource,
    nCases,
    nControls,
    cohorts,
    ldPopulationStructure,
    qualityControls,
    analysisFlags,
    discoverySamples,
  } = data?.gwasStudy?.[0] || {};

  return (
    <BaseProfileHeader>
      <>
        <Field loading={loading} title="Author">
          { 
            studyCategory === "GWAS" || studyCategory === "QTL"
              ? publicationFirstAuthor
              : "FINNGEN"
          }
        </Field>
        <Field loading={loading} title="Publication date">
          { 
            studyCategory === "GWAS" || studyCategory === "QTL"
              ? publicationDate
              : "2023"
          }
        </Field>
        <Field loading={loading} title="Journal">
          { 
            (studyCategory === "GWAS" || studyCategory === "QTL") &&
            publicationJournal
          } 
        </Field>
        <Field loading={loading} title="PubMed">
          { 
            (studyCategory === "GWAS" || studyCategory === "QTL") && pubmedId
              ? <Link external to={`https://europepmc.org/article/med/${pubmedId}`}>
                  {pubmedId}
                </Link>
              : null
          } 
        </Field>
        <Field loading={loading} title="Trait from source">
          {traitFromSource}
        </Field>
        <Field loading={loading} title="Sample size">
          {nSamples}
        </Field>
        <Field loading={loading} title="N discovery">
          { 
            studyCategory === "GWAS"
              ? initialSampleSize
              : studyCategory === "FINNGEN"
                ? (discoverySamples?.length
                    ? (initialSampleSize
                        ? <Tooltip
                            title={
                              <Typography variant="caption">
                                Initial sample size: {initialSampleSize}
                              </Typography>
                            }
                            showHelpIcon
                          >
                            {formatSamples(discoverySamples)}
                          </Tooltip>
                        : formatSamples(discoverySamples)
                      )
                    : null
                  )
                : null
          } 
        </Field>
        <Field loading={loading} title="N replication">
            { 
              studyCategory === "GWAS" &&
              replicationSamples?.length &&
              formatSamples(replicationSamples)
            }
          </Field>
          <Field loading={loading} title="N cases">
            { 
              (studyCategory === "GWAS" || studyCategory === "FINNGEN") &&
              (typeof nCases === "number") &&
              nCases
            } 
          </Field>
          <Field loading={loading} title="N controls">
            { 
              (studyCategory === "GWAS" || studyCategory === "FINNGEN") && 
              (typeof nControls === "number") &&
              nControls
            } 
          </Field>
          <Field loading={loading} title="Cohorts">
            { 
              (
                (studyCategory === "GWAS" && cohorts?.length) ||
                (studyCategory === "FINNGEN")
              ) && (ldPopulationStructure?.length
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
                    {studyCategory === 'GWAS' ? cohorts.join(", ") : "FinnGen"}
                  </Tooltip>
                : (studyCategory === 'GWAS' ? cohorts.join(", ") : "FinnGen")
              )
            }
          </Field>
          <Field loading={loading} title="QC">
            { 
              studyCategory === "GWAS" &&
              qualityControls?.length &&
              qualityControls.join(", ")
            } 
          </Field>
          <Field loading={loading} title="Study flags">
            { 
              studyCategory === "GWAS" &&
              analysisFlags?.length &&
              analysisFlags.join(", ")
            } 
          </Field>
      </>
    </BaseProfileHeader>
  );
}

ProfileHeader.fragments = {
  profileHeader: STUDY_PROFILE_HEADER_FRAGMENT,
};

export default ProfileHeader;
