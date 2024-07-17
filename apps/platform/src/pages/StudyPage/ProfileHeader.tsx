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
          {nSamples}
        </Field>
        <Field loading={loading} title="N discovery">
          { 
            studyType === "GWAS"
              ? initialSampleSize
              : studyType === "FINNGEN"
                ? discoverySamples.length  // USE LENGTH??? - AND NEED TO ADD initialSampleSize TOOLTIP HERE!!!
                : naLabel
          } 
        </Field>
       <Field loading={loading} title="N replication">
          { 
            studyType === "GWAS"
              ? replicationSamples.length  // ?? USE LENGTH
              : naLabel
          } 
        </Field>
        <Field loading={loading} title="N cases">
          { 
            studyType === "GWAS" || studyType === "FINNGEN"
              ? nCases
              : naLabel
          } 
        </Field>
        <Field loading={loading} title="N controls">
          { 
            studyType === "GWAS" || studyType === "FINNGEN"
              ? nControls
              : naLabel
          } 
        </Field>
        <Field loading={loading} title="Cohorts">
          TODO
        </Field>
        <Field loading={loading} title="QC">
          TODO
        </Field>
        <Field loading={loading} title="Study flags">
          TODO
        </Field>
      </>
    </BaseProfileHeader>
  );
}

ProfileHeader.fragments = {
  profileHeader: STUDY_PROFILE_HEADER_FRAGMENT,
};

export default ProfileHeader;
