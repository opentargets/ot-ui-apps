import { definition } from '.';
import { Body as Bibliography } from '../../common/Literature';

import DRUGS_LITERATURE_OCURRENCES from './BibliographyQuery.gql';

function Body({ id, label: name }) {
  return (
    <Bibliography
      definition={definition}
      entity="drug"
      id={id}
      name={name}
      BODY_QUERY={DRUGS_LITERATURE_OCURRENCES}
    />
  );
}

export default Body;
