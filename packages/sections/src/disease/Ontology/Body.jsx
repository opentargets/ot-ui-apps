import { useState, useEffect } from "react";
import { SectionItem } from "ui";

import Description from "./Description";
import OntologySubgraph from "./OntologySubgraph";
import config from "../../config";
import { definition } from "./index";

function Body({ id: efoId, label: name, entity }) {
  const [efoNodes, setEfoNodes] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    fetch(config.efoURL)
      .then(res => res.text())
      .then(lines => {
        if (isCurrent) {
          const nodes = lines.trim().split("\n").map(JSON.parse);
          setEfoNodes(nodes);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={{
        loading: !efoNodes,
        data: {
          [entity]: { efoNodes },
        },
      }}
      showContentLoading={true}
      renderDescription={() => <Description name={name} />}
      renderBody={() => {
        const idToDisease = efoNodes.reduce((acc, disease) => {
          acc[disease.id] = disease;
          return acc;
        }, {});
        return (
          <OntologySubgraph efoId={efoId} efo={efoNodes} name={name} idToDisease={idToDisease} />
        );
      }}
    />
  );
}

export default Body;
