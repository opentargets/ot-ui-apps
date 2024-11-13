import { useState, useEffect } from "react";
import { SectionItem } from "ui";

import Description from "./Description";
import OntologySubgraph from "./OntologySubgraph";
import config from "../../config";
import { definition } from "./index";

function Body({ id: efoId, label: name, entity }) {
  const [efoNodes, setEfoNodes] = useState({
    allNodes: null,
    filteredNodes: null,
  });

  function requestEfoNodes() {
    fetch(config.efoURL)
      .then(res => res.text())
      .then(lines => {
        const nodes = lines.trim().split("\n").map(JSON.parse);
        const idToDisease = nodes.reduce((acc, disease) => {
          acc[disease.id] = disease;
          return acc;
        }, {});
        setEfoNodes({ allNodes: nodes, filteredNodes: idToDisease });
      });
  }

  useEffect(() => {
    let isCurrent = true;
    if (isCurrent) requestEfoNodes();

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={{
        loading: !efoNodes.filteredNodes,
        data: {
          [entity]: { efoNodes: efoNodes.allNodes },
        },
      }}
      showContentLoading={true}
      renderDescription={() => <Description name={name} />}
      renderBody={() => {
        return (
          <OntologySubgraph
            efoId={efoId}
            efo={efoNodes.allNodes}
            name={name}
            idToDisease={efoNodes.filteredNodes}
          />
        );
      }}
    />
  );
}

export default Body;
