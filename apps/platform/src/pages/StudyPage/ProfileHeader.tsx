import {
  usePlatformApi,
  Link,
  Field,
  ProfileHeader as BaseProfileHeader,
  Tooltip,
} from "ui";
import { naLabel } from "../../constants";
import { Typography, Box } from "@mui/material";

import STUDY_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";

function formatSamples(samples: any[]) {  // wait until get types directly from schema
  return samples
    .map(({ ancestry, sampleSize }) => `${ancestry}: ${sampleSize}`)
    .join(", ");
}

function ProfileHeader({ studyCategory }) {
  const { loading, error, data } = usePlatformApi();

  // TODO: Errors!
  if (error) return null;

  const {
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
  } = data?.gwasStudy?.[0] || {};

  return (
    <BaseProfileHeader>
      <>
        <Field loading={loading} title="Author">
          { 
            studyCategory === "GWAS" || studyCategory === "QTL"
              ? (publicationFirstAuthor ?? naLabel)
              : "FINNGEN_R10"
          }
        </Field>
        <Field loading={loading} title="Publication date">
          { 
            studyCategory === "GWAS" || studyCategory === "QTL"
              ? (publicationDate ?? naLabel)
              : "2023"
          }
        </Field>
        <Field loading={loading} title="Journal">
          { 
            studyCategory === "GWAS" || studyCategory === "QTL"
              ? (publicationJournal ?? naLabel)
              : naLabel
          } 
        </Field>
        <Field loading={loading} title="PubMed">
          { 
            (studyCategory === "GWAS" || studyCategory === "QTL") && pubmedId
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
              : `yes ${studyCategory === "QTL" && summarystatsLocation
                  ? `—  ${summarystatsLocation}`
                  : ''
                }`
          }
        </Field>
        <Field loading={loading} title="N study">
          {nSamples ?? naLabel}
        </Field>
        <Field loading={loading} title="N discovery">
          { 
            studyCategory === "GWAS"
              ? (initialSampleSize ?? naLabel)
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
              (studyCategory === "GWAS" || studyCategory === "FINNGEN") &&
              (typeof nCases === "number")
                ? nCases
                : naLabel
            } 
          </Field>
          <Field loading={loading} title="N controls">
            { 
              (studyCategory === "GWAS" || studyCategory === "FINNGEN") && 
              (typeof nControls === "number")
                ? nControls
                : naLabel
            } 
          </Field>
          <Field loading={loading} title="Cohorts">
            { 
              (studyCategory === "GWAS" && cohorts?.length) || (studyCategory === "FINNGEN")
                ? (ldPopulationStructure?.length
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
                : naLabel
            }
          </Field>
          <Field loading={loading} title="QC">
            { 
              studyCategory === "GWAS" && qualityControls?.length
                ? qualityControls.join(", ")
                : naLabel
            } 
          </Field>
          <Field loading={loading} title="Study flags">
            { 
              studyCategory === "GWAS" && analysisFlags?.length
                ? analysisFlags.join(", ")
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
