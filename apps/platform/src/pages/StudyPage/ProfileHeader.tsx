import {
  usePlatformApi,
  Link,
  ProfileChipList,
  ProfileDescription,
  Field,
  ProfileHeader as BaseProfileHeader,
  Tooltip,
} from "ui";
import { naLabel } from "../../constants";
import { Typography, Box } from "@mui/material";

import STUDY_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";

function formatSamples(samples) {
  return samples
    .map(({ ancestory, sampleSize }) => `${ancestory}: ${sampleSize}`)
    .join(", ");
}

function ProfileHeader({ studyId, studyCategory }) {
  const { loading, error, data } = usePlatformApi();

  // TODO: Errors!
  if (error) return null;

  const {
    projectId,
    publicationFirstAuthor,
    publicationDate,
    publicationJournal,
    pubmedId,
    summarystatsLocation,
    nSamples,
    initialSampleSize,
    replicationSamples,
    nCases,
    nControls,
    cohorts,
    ldPopulationStructure,
    qualityControls,
    analysisFlags,
    discoverySamples,
  } = data?.gwasStudy || {};

  return (
    <BaseProfileHeader>
      <>
        <Field loading={loading} title="Author">
          { 
            studyCategory === "GWAS" || studyCategory === "QTL"
              ? publicationFirstAuthor
              : "FINNGEN_R10"
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
            studyCategory === "GWAS" || studyCategory === "QTL"
              ? publicationJournal
              : naLabel
          } 
        </Field>
        <Field loading={loading} title="PubMed">
          { 
            studyCategory === "GWAS" || studyCategory === "QTL"
              ? <Link external to={`https://europepmc.org/article/med/${pubmedId}`}>
                  {pubmedId}
                </Link>
              : naLabel
          } 
        </Field>
        <Field loading={loading} title="Has summary stats">
          { 
            studyCategory === "GWAS"
              ? (summarystatsLocation ? "yes" : "no")
              : "yes"
          } 
        </Field>
        <Field loading={loading} title="N study">
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
                          >
                            formatSamples(discoverySamples)
                          </Tooltip>
                        : formatSamples(discoverySamples)
                      )
                    : naLabel
                  )
                : naLabel
          } 
        </Field>
        <Field loading={loading} title="N replication">
            { 
              studyCategory === "GWAS"
                ? (replicationSamples?.length
                    ? formatSamples(replicationSamples)
                    : naLabel
                  )
                : naLabel
            }
          </Field>
          <Field loading={loading} title="N cases">
            { 
              studyCategory === "GWAS" || studyCategory === "FINNGEN"
                ? nCases
                : naLabel
            } 
          </Field>
          <Field loading={loading} title="N controls">
            { 
              studyCategory === "GWAS" || studyCategory === "FINNGEN"
                ? nControls
                : naLabel
            } 
          </Field>
          <Field loading={loading} title="Cohorts">
            { 
              (studyCategory === "GWAS" && cohorts) || (studyCategory === "FINNGEN")
                ? (ldPopulationStructure
                    ? <Tooltip
                        title={
                          <>
                            <Typography variant="subtitle2" display="block" align="center">
                              LD structure:
                            </Typography>
                            {ldPopulationStructure.map(({ ldPopulation, relativeSampleSize }) => (
                              <Box key={ldPopulation}>
                                <Typography variant="caption">
                                  LD population: {ldPopulation}, relative sample size: {relativeSampleSize}
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
                : naLabel
            }
          </Field>
          <Field loading={loading} title="QC">
            { 
              studyCategory === "GWAS"
                ? (qualityControls ?? naLabel)
                : naLabel
            } 
          </Field>
          <Field loading={loading} title="Study flags">
            { 
              studyCategory === "GWAS"
                ? (analysisFlags ?? naLabel)
                : naLabel
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
