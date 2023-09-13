import { useRef, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import { withContentRect } from 'react-measure';
import { scaleQuantize, pack, hierarchy } from 'd3';
import { v1 } from 'uuid';
import { Legend, DownloadSvgPlot } from 'ui';

import AssociationTooltip from './AssociationTooltip';
import { colorRange } from '../../constants';
import Slider from './ClassicAssociationsSlider';

function findTas(id, idToDisease) {
  const tas = new Set();
  const diseaseNode = idToDisease[id];
  if (diseaseNode.parentIds.length === 0) {
    return tas;
  }
  const queue = [id];
  while (queue.length > 0) {
    const diseaseId = queue.shift();
    const node = idToDisease[diseaseId];
    if (node.parentIds.length === 0) {
      tas.add(diseaseId);
    }
    for (let i = 0; i < node.parentIds.length; i++) {
      const parentId = node.parentIds[i];
      if (!queue.includes(parentId)) {
        queue.push(parentId);
      }
    }
  }

  return tas;
}

function buildHierarchicalData(associations, idToDisease) {
  const tasMap = {};
  const tasScore = {};
  associations.forEach(association => {
    const diseaseId = association.disease.id;
    if (idToDisease[diseaseId].parentIds.length === 0) {
      tasScore[diseaseId] = association.score;
    }
    const tas = findTas(diseaseId, idToDisease);
    tas.forEach(ta => {
      const assocData = {
        id: diseaseId,
        uniqueId: `${ta}-${diseaseId}`,
        name: association.disease.name,
        score: association.score,
      };
      if (tasMap[ta]) {
        tasMap[ta].push(assocData);
      } else {
        tasMap[ta] = [assocData];
      }
    });
  });

  return {
    uniqueId: 'EFO_ROOT',
    children: Object.entries(tasMap).map(([taId, descendants]) => ({
      id: taId,
      uniqueId: taId,
      name: idToDisease[taId].name,
      score: tasScore[taId],
      children: descendants,
    })),
  };
}

const color = scaleQuantize().domain([0, 1]).range(colorRange);

function ClassicAssociationsBubbles({
  ensemblId,
  symbol,
  idToDisease,
  associations,
  measureRef,
  contentRect,
}) {
  const [minScore, setMinScore] = useState(0.1);
  const svgRef = useRef(null);
  const theme = useTheme();
  const assocs = associations.filter(assoc => assoc.score >= minScore);
  const { width: size } = contentRect.bounds;

  const hierarchicalData = buildHierarchicalData(assocs, idToDisease);
  const root = hierarchy(hierarchicalData);
  const packLayout = pack()
    .size([size, size])
    .padding(node => (node.data.uniqueId === 'EFO_ROOT' ? 17 : 2));
  root.sum(d => d.score);
  packLayout(root);

  let ASSOCIATION_COMPONENT = null;

  function getText({ node }) {
    if (node.data.uniqueId === 'EFO_ROOT') return null;
    if (node.parent && node.parent.data.uniqueId === 'EFO_ROOT')
      return (
        <text
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill={theme.palette.grey[400]}
          pointerEvents="none"
        >
          <textPath startOffset="50%" xlinkHref={`#${node.data.uniqueId}`}>
            {node.data.name}
          </textPath>
        </text>
      );
    if (node.r <= 15) return null;
    return (
      <>
        <clipPath id={`clip-${node.data.uniqueId}`}>
          <circle cx="0" cy="0" r={node.r} />
        </clipPath>
        <text
          clipPath={`url(#clip-${node.data.uniqueId})`}
          fontSize="11"
          textAnchor="middle"
          pointerEvents="none"
        >
          {node.data.name.split(' ').map((word, i, words) => (
            <tspan key={v1()} x="0" y={`${i - words.length / 2 + 0.8}em`}>
              {word}
            </tspan>
          ))}
        </text>
      </>
    );
  }

  if (size && assocs.length > 0) {
    ASSOCIATION_COMPONENT = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        ref={svgRef}
        height={size}
        width={size}
      >
        {root.descendants().map(node => (
          <g
            key={node.data.uniqueId}
            transform={`translate(${node.x},${node.y})`}
          >
            <AssociationTooltip
              ensemblId={ensemblId}
              efoId={node.data.id}
              name={node.data.name}
              score={node.data.score}
            >
              <path
                id={node.data.uniqueId}
                d={`M 0, ${node.r} a ${node.r},${node.r} 0 1,1 0,-${
                  2 * node.r
                } a ${node.r},${node.r} 0 1,1 0,${2 * node.r}`}
                stroke={
                  node.data.uniqueId !== 'EFO_ROOT'
                    ? theme.palette.grey[400]
                    : 'none'
                }
                fill={
                  node.data.uniqueId === 'EFO_ROOT' ||
                  node.parent.data.uniqueId === 'EFO_ROOT'
                    ? theme.palette.grey[50]
                    : color(node.data.score)
                }
                pointerEvents={
                  node.data.uniqueId === 'EFO_ROOT' ? 'none' : 'auto'
                }
              />
            </AssociationTooltip>
            {getText({ node })}
          </g>
        ))}
      </svg>
    );
  } else if (size) {
    ASSOCIATION_COMPONENT = (
      <Typography>
        No associations with score greater than or equal to {minScore}
      </Typography>
    );
  }

  return (
    <>
      <DownloadSvgPlot
        svgContainer={svgRef}
        filenameStem={`${symbol}-associated-diseases-bubbles`}
      >
        <Slider value={minScore} onChange={(_, val) => setMinScore(val)} />
        <Grid
          item
          container
          ref={measureRef}
          md={10}
          justifyContent="center"
          alignItems="center"
          style={{ margin: '0 auto', minHeight: '340px' }}
        >
          {ASSOCIATION_COMPONENT}
        </Grid>
      </DownloadSvgPlot>
      <Legend />
    </>
  );
}

export default withContentRect('bounds')(ClassicAssociationsBubbles);
