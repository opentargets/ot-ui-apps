
import { useEffect, useRef, useCallback, Fragment } from "react";
import {
  GenTrack,
  useGenTrackState,
  useGenTrackTooltipDispatch,
  useGenTrackTooltipState
} from "ui";
import { Container, Sprite, Graphics, Text  } from '@pixi/react';
import {
  Sprite as PixiSprite,
  Text as PixiText,
  TextStyle,
} from "pixi.js";
import { Box, Typography } from "@mui/material";
import {
  Rectangle,
  useCircleTexture,
  useRingTexture,
} from "ui/src/components/GenTrack/shapes";
import { scaleLinear, axisTop, select, max, sum } from "d3";

function MyTooltip() {
  const { datum } = useGenTrackTooltipState() ?? {};
  if (!datum) return null;
  return (
    <Box sx={{ p: 0.5, border: "1px solid #bbb", borderRadius: 2, bgcolor: "#fff" }}>
      {JSON.stringify(datum)}
    </Box>
  );
}

// const colorPairs = [[6, 7], [8, 9], [12, 13]].map(([i, j]) => {
//   return [schemePaired[i], schemePaired[j]];
// });

const geneScheme = [
  // d3 schemeCategory10
  // 0x1f77b4,
  0xff7f0e,
  0x2ca02c,
  0xd62728,
  0x9467bd,
  0x8c564b,
  0xe377c2,
  0x7f7f7f,
  0xbcbd22,
  0x17becf,

  // d3 schemeTableau10
  // 0x4e79a7,
  // 0xf28e2b,
  // 0xe15759,
  // 0x76b7b2,
  // 0x59a14f,
  // 0xedc948,
  // 0xb07aa1,
  // 0xff9da7,
  // 0x9c755f,
  // 0xbab0ab,
];

function XInfo({ start, end, canvasWidth }) {
  const axisRef = useRef(null);

  useEffect(() => {
    const scale = scaleLinear()
      .domain([start, end])
      .range([0, canvasWidth]);

    const axis = axisTop(scale)
      .ticks(8)
      .tickSizeOuter(0);

    select(axisRef.current)
      .call(axis)
      .selectAll("text")
      .style("font-size", "11px")
      .style("font-family", "'Inter', sans-serif");
  }, [start, end, canvasWidth]);

  return (
    <svg width={canvasWidth} height={30} style={{ overflow: "visible" }}>
      <g ref={axisRef} transform="translate(0, 30)" />
    </svg>
  );
}

const infoStyle = {
  // background: "#f0f0f0",
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "end",
  alignItems: "center" 
};

function XYInfo({ data }) {
  return (
    <Box sx={{ ...infoStyle, alignItems: "end"}}>
      <Typography component="div" variant="caption" sx={{ height: "12px", fontSize: "11px" }}>
        Chr {data.locus.rows[0].variant.chromosome}
      </Typography>
    </Box>
  );
}

function tickScaleFactory(filterActionPairs) {
  return (wrapper) => {
    objectLoop: for (const obj of wrapper.children[0].children) {
      for (const { filterFn, actionFn } of filterActionPairs) {
        if (filterFn(obj)) {
          actionFn(obj, wrapper);
          continue objectLoop;
        }
      }
    }
  };
}

function sumInclusiveIntervals(intervals) {
  const events = new Map();

  for (const { start, end, score } of intervals) {
    // interval is [start, end] inclusive
    events.set(start, (events.get(start) || 0) + score);
    events.set(end + 1, (events.get(end + 1) || 0) - score);
  }

  const positions = [...events.keys()].sort((a, b) => a - b);

  const result = [];
  let totalScore = 0;

  for (const pos of positions) {
    const delta = events.get(pos);
    const nextTotal = totalScore + delta;

    // only emit when score changes
    if (result.length === 0 || nextTotal !== totalScore) {
      result.push({
        position: pos,
        totalScore: nextTotal
      });
    }

    totalScore = nextTotal;
  }

  return result;
}

function BodyContentInner() {

  const genTrackState = useGenTrackState();
  const { data, xMin, xMax } = genTrackState;

  const genTrackTooltipDispatch = useGenTrackTooltipDispatch();

  const variantWidth = 10;
  const yGridDenominator = 50;
  const yGridColor = 0xbbbbbb;
  const circleTrackHeight = 30;
  const labelColor = 0x222222;
  const tracks = [];

  // fixed-circle size variants
  tracks.push({
    id: `variants`,
    height: circleTrackHeight,
    paddingTop: 16,
    yMin: 0,
    yMax: 100,
    YInfo: () => (
      <Box sx={infoStyle}> 
        <Typography component="div" variant="caption" sx={{ fontWeight: 500 }}>
          Variants
        </Typography>
      </Box>
    ),
    Track: ({ isInner }) => {
      const ringTexture = useRingTexture(32, 10);
      const circleTexture = useCircleTexture(32);
      
      const drawHLine = useCallback((g) => {
        g.clear();
        g.lineStyle(100 / yGridDenominator, yGridColor, 1);
        g.moveTo(xMin, 50);
        g.lineTo(xMax, 50);
      }, [xMin, xMax]);
      
      return (
        <Container>

          {/* horizontal line */}
          <Graphics draw={drawHLine} />
          
          {/* all variants */}
          {data.locus.rows.map(({ variant }, i) => (
            <Sprite
              key={i}
              texture={ringTexture}
              x={variant.position}
              y={50}
              anchor={[0.5, 0.5]}
              height={variantWidth / circleTrackHeight * 100}
              tint="steelblue"
              // tint={0x444444}
              // alpha={0.9}
            />
          ))}

          {/* lead variants */}
          <Sprite
            texture={circleTexture}
            x={data.variant.position}
            y={50}
            anchor={[0.5, 0.5]}
            height={variantWidth / circleTrackHeight * 100}
            // tint={0x444444}
            tint="steelblue"
            // alpha={0.9}
          />

          {/* label the lead variant */}
          <Text
            text="Lead"
            x={data.variant.position}
            y={25}
            anchor={[0.5, 1]}
            style={
              new TextStyle({
                align: 'center',
                fill: labelColor,
                // fill: 0x457093,
                fontSize: 11,
                fontWeight: '100',
                wordWrap: false,
              })
            }
          />
        </Container>
      );
    },
    // scale circles and text to stop stretched/squished appearance
    onTick: tickScaleFactory([
      {
        filterFn: obj => obj instanceof PixiText,  // look for text first as is also a sprite
        actionFn: (obj, wrapper) => {
          obj.scale.x = 1 / (wrapper.scale.x * wrapper.parent.scale.x);
          obj.scale.y = 1 / (wrapper.scale.y * wrapper.parent.scale.y);
        }
      },
      {
        filterFn: obj => obj instanceof PixiSprite,
        actionFn: (obj, wrapper) => {
          obj.width = variantWidth / (wrapper.scale.x * wrapper.parent.scale.x);
        }
      },
    ])
  });

  // genes and L2G scores
  const geneLookup = {};
  for (const [i, { target }] of data.l2GPredictions.rows.entries()) {
    geneLookup[target.id] = { symbol: target.approvedSymbol, color: geneScheme[i] };
  }
  if (data.l2GPredictions.count) {
    tracks.push({
      id: `genes`,
      height: 30,
      paddingTop: 16,
      yMin: 0,
      yMax: 100,
      YInfo: () => (
        <Box sx={infoStyle}> 
          <Typography component="div" variant="caption" sx={{ fontWeight: 500 }}>
            Genes and L2G scores
          </Typography>
        </Box>
      ),
      Track: () => {

        const drawHLine = useCallback((g) => {
          g.clear();
          g.lineStyle(100 / yGridDenominator, yGridColor, 1);
          g.moveTo(xMin, 50);
          g.lineTo(xMax, 50);
        }, [xMin, xMax]);

        return (
          <Container>

            {/* horizontal line */}
            <Graphics draw={drawHLine} />
            
            {/* genes - use graphics objects since not many */}
            {data.l2GPredictions.rows.map(({ score, target }, i) => {
              const { start, end } = target.genomicLocation
              return (
                <Fragment key={i}>
                  <Rectangle
                    x={start}
                    y={34}
                    width={end - start}
                    height={32}
                    color={geneScheme[i]}
                  />
                  <Text
                    text={`${target.approvedSymbol}: ${score.toFixed(3)}`}
                    x={start}
                    y={25}
                    anchor={[0, 1]}
                    style={
                      new TextStyle({
                        align: 'center',
                        fill: labelColor,
                        fontSize: 11,
                        fontWeight: '100',
                        wordWrap: false,
                      })
                    }
                  />
                </Fragment>
              );
            })}
          </Container>
        );
      },
      onTick: tickScaleFactory([
        {
          filterFn: obj => obj instanceof PixiText,  // look for text first as is also a sprite
          actionFn: (obj, wrapper) => {
            obj.scale.x = 1 / (wrapper.scale.x * wrapper.parent.scale.x);
            obj.scale.y = 1 / (wrapper.scale.y * wrapper.parent.scale.y);
          }
        },
      ]),
    });
  }

  // enhancer-to-gene
  if (data.variant.intervals.count > 0) {
    const enhancersByGene = Object.groupBy(data.variant.intervals.rows, row => row.target.id);
    const distributionByGene = {};
    // console.log(enhancersByGene);
    for (const [geneId, enhancers] of Object.entries(enhancersByGene)) {
      distributionByGene[geneId] = sumInclusiveIntervals(enhancers);
    }
    const maxTotalScores = [];
    for (const [geneId, distribution] of Object.entries(distributionByGene)) {
      maxTotalScores.push({
        geneId,
        maxTotalScore: max(distribution, d => d.totalScore)
      });
    }
    maxTotalScores.sort((a, b) => b.maxTotalScore - a.maxTotalScore);
    const maxTotal = maxTotalScores[0].maxTotalScore;
    for (const { geneId } of maxTotalScores) {
      const distribution = distributionByGene[geneId];
      tracks.push({
        id: `e2g-${geneId}`,
        height: 30,
        paddingTop: 16,
        yMin: 0,
        yMax: maxTotal,
        YInfo: () => (
          <Box sx={infoStyle}> 
            <Typography component="div" variant="caption" sx={{ fontWeight: 500 }}>
              {geneLookup[geneId].symbol} enhancers
            </Typography>
          </Box>
        ),
        Track: () => {

          const drawHLine = useCallback((g) => {
            g.clear();
            g.lineStyle(maxTotal / yGridDenominator, yGridColor, 1);
            g.moveTo(xMin, maxTotal - (maxTotal / yGridDenominator) / 2);  // shift up by 1/2 line width since at bottom
            g.lineTo(xMax, maxTotal - (maxTotal / yGridDenominator) / 2 );
          }, [xMin, xMax]);

          const drawDistribution = useCallback((g) => {
            g.clear();
            g.beginFill(geneLookup[geneId].color, 0.75);

            // move to baseline start
            g.moveTo(distribution[0].position, maxTotal);

            // draw top line
            for (const { position, totalScore } of distribution) {
              g.lineTo(position, maxTotal - totalScore);
            }

            // close shape back to baseline
            g.lineTo(distribution.at(-1).position, maxTotal);
            g.closePath();

            g.endFill();
          }, [xMin, xMax]);

          return (
            <Container>

              {/* horizontal line */}
              <Graphics draw={drawHLine} />

              {/* enhancer distribution */}
              <Graphics draw={drawDistribution} />

            </Container>
          );
        },
      });
    }
  }

  // mol-QTL
  if (data.molqtlcolocalisation.count > 0) {
    const qtlsByPosition = Object.groupBy(
      data.molqtlcolocalisation.rows,
      d => d.otherStudyLocus.variant.position
    );
    const qtlsAggregated = [];
    for (const [position, positionGroup] of Object.entries(qtlsByPosition)) {
      const groupByGene = [...Map.groupBy(positionGroup, obj => obj.otherStudyLocus.study.target.id)];
      let dominantGeneId = null;
      let dominantGeneClpp = -Infinity;
      for (const [geneId, geneGroup] of groupByGene) {
        const geneClpp = sum(geneGroup, obj => obj.clpp);
        if (geneClpp > dominantGeneClpp) {
          dominantGeneId = geneId;
          dominantGeneClpp = geneClpp;
        }
      }
      const summedClpp = sum(positionGroup, obj => obj.clpp)
      const direction = sum(positionGroup, ({ clpp, betaRatioSignAverage }) => {
        const wt = betaRatioSignAverage > 0 ? 1 : (betaRatioSignAverage < 0 ? -1 : 0);
        return clpp * wt;
      });
      const isTrans = sum(positionGroup, obj => {
        const { isTransQtl } = obj.otherStudyLocus;
        return (isTransQtl ? 1 : -1) * obj.clpp;  // !! ASSUMES FALSY MEANS CIS - IS THIS CORRECT OR CAN HAVE NULL?
      });
      qtlsAggregated.push({
        position,
        summedClpp,
        direction,
        dominantGeneId,
        isTrans, 
      });
    }
    console.log(qtlsAggregated)
    !!!! NOW PLOT !!!!!!
  }

  return (
    <Box sx={{mr: 3}}>
      <GenTrack
        XInfo={XInfo}
        XYInfo={XYInfo}
        tracks={tracks}
        InnerXInfo={XInfo}
        innerTracks={tracks}
        // InnerXYInfo={XYInfo}
        yInfoGap={8}
        yInfoWidth={140}
        zoomLines
      />
      {/* <Intro /> */}
    </Box>
  );
}

export default BodyContentInner;

/*
TO DO:
- getting error for many ssets, e.g d75d13864ef5532c8f5bbe7c8334c99e
- why gene sometimes has no label? e.g. credible-set/4a5402cdec4ba249d1e6c944803950d5
- abstrct repeated code in to functions, inc:
  - draw functions for graphics (e.g. horizontal line)
- e2g
  - are we guaranteed that all genes that have enhancers assigend to them are in the L2G track?
  - smooth the enhancer distributions? - e.g. bezier and may also need to look at Pixi options like resolutin so
    actually displayed smoothly
  - what if a very narrow spike? - is it visible?
- should show intros and exons on genes? - do we have them?
- get x-limits from all data - not just variants + padding
- give labels (partic e.g. gene: L2G score) a background so clear when over lap
- l2g scores: make highest bold
- make scaling for fixed pixel size or text aspect rario efficient - only scale on init,
  canvas width changes and x-limit changes
    - since use a factory function, can store canvasWidth, xMin, xMax and return early if
      no change
- inner track showing bases: base color (when not at too high a range) and base letter (when zoomed closer)? 
  - what is the gene is on the other strand? - if not shwoing this info base info poss useless/misleading?
*/