import React from 'react';

import { Body as Bibliography } from '../../common/Literature';

import DISEASE_LITERATURE_OCURRENCES from './BibliographyQuery.gql';

function Body({ definition, id, label: name }) {
  return (
    <Bibliography
      definition={definition}
      entity="disease"
      id={id}
      name={name}
      BODY_QUERY={DISEASE_LITERATURE_OCURRENCES}
    />
  );
}

export default Body;
