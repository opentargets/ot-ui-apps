/**
 * Shared Trait Studies widget.
 *
 * The section Body requires both studyId and the study's diseaseIds.
 * This wrapper fetches diseaseIds first, then delegates to the real Body.
 */
import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Skeleton } from "@mui/material";
import Body from "@ot/sections/study/SharedTraitStudies/Body";

const STUDY_DISEASES_QUERY = gql`
  query StudyDiseasesForSharedTraits($studyId: String!) {
    study(studyId: $studyId) {
      diseases {
        id
      }
    }
  }
`;

export default function SharedTraitStudiesWidget({ studyId }: { studyId: string }) {
  const { data, loading, error } = useQuery(STUDY_DISEASES_QUERY, { variables: { studyId } });

  if (loading) return <Skeleton variant="rectangular" height={200} />;
  if (error || !data?.study) return null;

  const diseaseIds: string[] = data.study.diseases?.map((d: { id: string }) => d.id) ?? [];

  return <Body studyId={studyId} diseaseIds={diseaseIds} />;
}
