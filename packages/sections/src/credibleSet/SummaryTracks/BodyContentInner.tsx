
import { useEffect, useRef, useCallback, Fragment } from "react";
import {
  GenTrack,
  useGenTrackState,
  useGenTrackTooltipDispatch,
  useGenTrackTooltipState
} from "ui";
import { Container, Sprite, Graphics, ParticleContainer, Text  } from '@pixi/react';
import {
  Graphics as PixiGraphics,
  Sprite as PixiSprite,
  Text as PixiText,
  TextStyle,
} from "pixi.js";
import { Box, Typography } from "@mui/material";
import {
  Rectangle,
  useRectangleTexture,
  useCircleTexture,
  useRingTexture,
} from "ui/src/components/GenTrack/shapes";
import { schemePaired, scaleLinear, axisTop, select, max } from "d3";

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

function BodyContentInner() {

  const genTrackState = useGenTrackState();
  const { data, xMin, xMax } = genTrackState;

  const genTrackTooltipDispatch = useGenTrackTooltipDispatch();

  const variantWidth = 10;
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
      
      const draw = useCallback((g) => {
        g.clear();
        g.lineStyle(2, 0xaaaaaa, 1);
        g.moveTo(xMin, 50);
        g.lineTo(xMax, 50);
      }, [xMin, xMax]);
      
      return (
        <Container>

          {/* horizontal line */}
          <Graphics draw={draw} />
          
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


  //   onTick: wrapper => {
  //     const xScale = wrapper.scale.x * wrapper.parent.scale.x;
  //     const yScale = wrapper.scale.y * wrapper.parent.scale.y;
  //     for (const obj of wrapper.children[0].children) {
  //       // if (obj instanceof PixiGraphics) continue;
  //       if (obj instanceof PixiText) {
  //         obj.scale.x = 1 / xScale;
  //         obj.scale.y = 1 / yScale;
  //       } else if (obj instanceof PixiSprite) {
  //         obj.width = variantWidth / xScale;
  //       }
  //     }
  //   },
  // });


  // genes and L2G scores
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
      Track: ({ isInner }) => {

        const draw = useCallback((g) => {
          g.clear();
          g.lineStyle(2, 0xaaaaaa, 1);
          g.moveTo(xMin, 50);
          g.lineTo(xMax, 50);
        }, [xMin, xMax]);

        return (
          <Container>

            {/* horizontal line */}
            <Graphics draw={draw} />
            
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

- get x-limits from all data - not just variants + padding
- give labels (partic e.g. gene: L2G score) a background so clear when over lap
- make scaling for fixed pixel size or text aspect rario efficient - only scale on init,
  canvas width changes and x-limit changes
    - since use a factory function, can store canvasWidth, xMin, xMax and return early if
      no change


*/