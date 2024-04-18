import { Body as Bibliography } from "../../common/Literature";
import { definition } from ".";
import TARGET_LITERATURE_OCURRENCES from "./SimilarEntities.gql";

function Body({ id, label: name, entity }) {
  return (
    <Bibliography
      definition={definition}
      entity={entity}
      id={id}
      name={name}
      BODY_QUERY={TARGET_LITERATURE_OCURRENCES}
    />
  );
}

export default Body;
