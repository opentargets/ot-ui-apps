import {
  usePlatformApi,
  Link,
  ProfileChipList,
  ProfileDescription,
  Field,
  ProfileHeader as BaseProfileHeader,
} from "ui";
import { naLabel } from "../../constants";
// import { Fragment } from "react";
// import { Box } from "@mui/material";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import STUDY_PROFILE_HEADER_FRAGMENT from "./ProfileHeader.gql";

function ProfileHeader({ studyId, studyType }) {
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
            studyType === "GWAS" || studyType === "QTL"
              ? publicationFirstAuthor
              : "FINNGEN_R10"
          }
        </Field>
        <Field loading={loading} title="Publication date">
          { 
            studyType === "GWAS" || studyType === "QTL"
              ? publicationDate
              : "2023"
          }
        </Field>
        <Field loading={loading} title="Journal">
          { 
             studyType === "GWAS" || studyType === "QTL"
              ? publicationJournal
              : naLabel
          } 
        </Field>
        <Field loading={loading} title="PubMed">
          { 
             studyType === "GWAS" || studyType === "QTL"
              ? <Link external to={`https://europepmc.org/article/med/${pubmedId}`}>
                  {pubmedId}
                </Link>
              : naLabel
          } 
        </Field>
        <Field loading={loading} title="Has summary stats">
          { 
             studyType === "GWAS"
              ? (summarystatsLocation ? "yes" : "no")
              : "yes"
          } 
        </Field>
        <Field loading={loading} title="N study">
        </Field>
        <Field loading={loading} title="N discovery">
        </Field>
        <Field loading={loading} title="N replication">
        </Field>
        <Field loading={loading} title="N cases">
        </Field>
        <Field loading={loading} title="N controls">
        </Field>
        <Field loading={loading} title="Cohorts">
        </Field>
        <Field loading={loading} title="QC">
        </Field>
        <Field loading={loading} title="Study flags">
        </Field>
      </>
    </BaseProfileHeader>
  );
}

ProfileHeader.fragments = {
  profileHeader: STUDY_PROFILE_HEADER_FRAGMENT,
};

export default ProfileHeader;
