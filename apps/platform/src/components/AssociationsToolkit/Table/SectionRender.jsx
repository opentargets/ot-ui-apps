import { Grid } from '@material-ui/core';
import { styled } from '@material-ui/styles';
import { gql, useQuery } from '@apollo/client';
import { cloneElement } from 'react';

import { LoadingBackdrop } from 'ui';
import ErrorBoundary from '../../ErrorBoundary';

import evidenceSections from '../../../pages/EvidencePage/sections';
import targetSections from '../../../pages/TargetPage/sections';

const SectionWrapper = styled('div')({
  marginTop: '10px',
  marginBottom: '40px',
});

const LoadingContainer = styled('div')({
  margin: '50px 0',
});

const getEvidenceSummaryQuery = sectionSumary => {
  const fragmentName = Object.keys(sectionSumary.fragments)[0];
  const sectionSummaryName =
    sectionSumary.fragments[fragmentName].definitions[0].selectionSet
      .selections[0].alias.value;
  const COUNT_QUERY = gql`
    query QUERY_EVIDENCE_SUMMARY($ensgId: String!, $efoId: String!) {
      disease(efoId: $efoId) {
        id
        ...${fragmentName}
      }
    }
    ${sectionSumary.fragments[fragmentName]}
  `;
  return { sectionSummaryName, COUNT_QUERY };
};

export function SecctionRendererWrapper({ activeSection, table, children }) {
  const isAssociations = table === 'associations';
  const pointer = isAssociations ? 1 : 2;
  const toSearch = activeSection[pointer];
  const sectionsToFilter = isAssociations ? evidenceSections : targetSections;
  const section = sectionsToFilter.find(el => el.definition.id === toSearch);

  // Validate if the active section is not in Evidence sections
  if (typeof section === 'undefined') return null;

  const ClonedChildren = cloneElement(children, { section, isAssociations });

  return (
    <SectionWrapper>
      <Grid id="summary-section" container spacing={1} justifyContent="center">
        <ErrorBoundary>{ClonedChildren}</ErrorBoundary>
      </Grid>
    </SectionWrapper>
  );
}

export function TargetSecctionRenderer({ section, entity, rowId, id, label }) {
  const { Body, definition } = section;
  const ensgId = entity === 'disease' ? rowId : id;
  return <Body definition={definition} id={ensgId} label={label} />;
}

export function EvidenceSecctionRenderer({ section, entity, rowId, id, row }) {
  const { BodyCore, definition, Summary } = section;
  const { diseaseName, targetSymbol } = row.original;
  const ensgId = entity === 'disease' ? rowId : id;
  const efoId = entity === 'disease' ? id : rowId;
  const label = { symbol: targetSymbol, name: diseaseName };

  const { COUNT_QUERY, sectionSummaryName } = getEvidenceSummaryQuery(Summary);
  const { loading, data } = useQuery(COUNT_QUERY, {
    variables: { ensgId, efoId },
  });

  if (loading)
    return (
      <LoadingContainer>
        <LoadingBackdrop />
        Loading section count
      </LoadingContainer>
    );

  const count = data?.disease[sectionSummaryName].count;
  if (!count) throw new Error('No count on section request');

  return (
    <BodyCore
      definition={definition}
      id={{ ensgId, efoId }}
      label={label}
      count={count}
    />
  );
}
