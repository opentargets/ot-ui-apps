import { Body as Bibliography } from "../../common/Literature";
import { definition } from ".";

import DISEASE_LITERATURE_OCURRENCES from "./BibliographyQuery.gql";

function Body({ id, label: name, entity }) {
  return (
    <Bibliography
      definition={definition}
      entity={entity}
      id={id}
      name={name}
      BODY_QUERY={DISEASE_LITERATURE_OCURRENCES}
    />
  );
}

export default Body;
