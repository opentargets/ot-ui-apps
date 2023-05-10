import { useState, useEffect } from 'react';

import Description from './Description';
import OntologySubgraph from './OntologySubgraph';
import SectionItem from '../../../components/Section/SectionItem';
import config from '../../../config';

function Body({ definition, id: efoId, label: name }) {
  const [efoNodes, setEfoNodes] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    fetch(config.efoURL)
      .then(res => res.text())
      .then(lines => {
        if (isCurrent) {
          const nodes = lines.trim().split('\n').map(JSON.parse);
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
      request={{
        loading: !efoNodes,
        data: { efoNodes },
      }}
      renderDescription={() => <Description name={name} />}
      renderBody={({ efoNodes: efoNodesArray }) => {
        const idToDisease = efoNodesArray.reduce((acc, disease) => {
          acc[disease.id] = disease;
          return acc;
        }, {});
        return (
          <OntologySubgraph
            efoId={efoId}
            efo={efoNodesArray}
            name={name}
            idToDisease={idToDisease}
          />
        );
      }}
    />
  );
}

export default Body;
