import { useState, useEffect } from 'react';
import { Skeleton } from '@mui/material';
import config from '../../config';
import useBatchDownloader from '../../hooks/useBatchDownloader';

import ASSOCIATIONS_VIZ_QUERY from './AssociationsViz.gql';

function Wrapper({ ensemblId, symbol, Component, aggregationFilters }) {
  const [nodes, setNodes] = useState();
  const [associations, setAssociations] = useState();

  const getAllAssociations = useBatchDownloader(
    ASSOCIATIONS_VIZ_QUERY,
    { ensemblId, aggregationFilters },
    'data.target.associatedDiseases'
  );

  useEffect(
    () => {
      let isCurrent = true;
      const promises = [
        fetch(config.efoURL).then(res => res.text()),
        getAllAssociations(),
      ];
      Promise.all(promises).then(data => {
        if (isCurrent) {
          const currentNodes = data[0].trim().split('\n').map(JSON.parse);
          setNodes(currentNodes);
          setAssociations(data[1]);
        }
      });

      return () => {isCurrent = false};
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ensemblId, aggregationFilters]
  );

  if (!nodes || !associations) {
    return <Skeleton variant="rect" height="40vh" />;
  }

  const idToDisease = nodes.reduce((acc, disease) => {
    acc[disease.id] = disease;
    return acc;
  }, {});

  return (
    <Component
      ensemblId={ensemblId}
      symbol={symbol}
      idToDisease={idToDisease}
      associations={associations}
    />
  );
}

export default Wrapper;
