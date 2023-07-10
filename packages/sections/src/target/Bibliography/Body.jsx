import { Body as Bibliography } from '../../common/Literature';
import { definition } from '.';
import TARGET_LITERATURE_OCURRENCES from './SimilarEntities.gql';

function Body({ id, label: name }) {
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
