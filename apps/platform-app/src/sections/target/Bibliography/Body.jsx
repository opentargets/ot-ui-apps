import React from 'react';

import { Body as Bibliography } from '../../common/Literature';

import TARGET_LITERATURE_OCURRENCES from './SimilarEntities.gql';

function Body({ definition, id, label: name }) {
  return (
    <Bibliography
      definition={definition}
      entity="target"
      id={id}
      name={name}
      BODY_QUERY={TARGET_LITERATURE_OCURRENCES}
    />
  );
}

export default Body;
