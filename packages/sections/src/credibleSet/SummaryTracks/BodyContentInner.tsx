
import { useEffect, useRef, useCallback } from "react";
import {
  GenTrack,
  useGenTrackState,
  useGenTrackTooltipDispatch,
  useGenTrackTooltipState
} from "ui";
import { Container, Sprite, Graphics, ParticleContainer } from '@pixi/react';
import { Graphics as PixiGraphics } from "pixi.js";
import { Box, Typography } from "@mui/material";
import { useRectangleTexture, useCircleTexture, useRingTexture } from "ui/src/components/GenTrack/shapes";
import { scaleLinear, axisTop, select, max } from "d3";

function MyTooltip() {
  const { datum } = useGenTrackTooltipState() ?? {};
  if (!datum) return null;
  return (
    <Box sx={{ p: 0.5, border: "1px solid #bbb", borderRadius: 2, bgcolor: "#fff" }}>
      {JSON.stringify(datum)}
    </Box>
  );
}

const colorScheme = [
  // d3 schemeCategory10
  0x1f77b4,
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
  0x4e79a7,
  0xf28e2b,
  0xe15759,
  0x76b7b2,
  0x59a14f,
  0xedc948,
  0xb07aa1,
  0xff9da7,
  0x9c755f,
  0xbab0ab,
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

function BodyContentInner({ data }) {

  const genTrackState = useGenTrackState();
  const { xMin, xMax } = genTrackState;

  const genTrackTooltipDispatch = useGenTrackTooltipDispatch();

  const variantWidth = 10;
  const circleTrackHeight = 30;
  const tracks = [
    
    // fixed-circle size variants
    {
      id: `circle-variants`,
      height: circleTrackHeight,
      paddingTop: 16,
      yMin: 0,
      yMax: 100,
      YInfo: ({}) => (
        <Box sx={infoStyle}> 
          <Typography component="div" variant="caption" sx={{ fontWeight: 600 }}>
            Variants
          </Typography>
        </Box>
      ),
      Track: () => {
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
                alpha={0.9}
              />
            ))}

            {/* lead variants */}
            <Sprite
              texture={circleTexture}
              x={data.variant.position}
              y={50}
              anchor={[0.5, 0.5]}
              height={variantWidth / circleTrackHeight * 100}
              tint="steelblue"
              alpha={0.9}
            />
          </Container>
        );
      },
      // fix circle pixel widths - ugly, particularly since need to skip horintal graphics line
      onTick: wrapper => {
        const xScale = wrapper.scale.x * wrapper.parent.scale.x;
        for (const obj of wrapper.children[0].children) {
          if (obj instanceof PixiGraphics) continue;
          obj.width = variantWidth / xScale;
        }
      }
    },

  ];

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
        yInfoWidth={100}
        zoomLines
      />
      {/* <Intro /> */}
    </Box>
  );
}

export default BodyContentInner;

// !!!!! THE VARIANTS ARE NOT IN EXACTLY THE CORRECT PLACE RELATIVE TO THE AXES!
//   - AND THERE POSITION RELATIVE TO IT CHANGES!
//   - FIRST CHECK HOW COMPUTING XMIN AND XMAX - AND ID USING CONSISTENTLY FOR TRACKS AND AXIS


//

  // fixed-width rectangular variants
    // {
    //   id: `variants`,
    //   height: 30,
    //   paddingTop: 16,
    //   yMin: 0,
    //   yMax: 100,
    //   YInfo: ({}) => (
    //     <Box sx={{ background: "#f0f0f0", width: "100%", height: "100%", p: 1 }}>
    //     <Typography variant="body2">
    //       <Box component="span" sx={{fontWeight: 600, pr: 2 }}>Variants</Box><br />
    //     </Typography>
    //     </Box>
    //   ),
    //   Track: () => {
    //     const texture = useRectangleTexture();
    //     return (
    //       <Container>
    //         {data.locus.rows.map(({ variant }, i) => (
    //           <Sprite
    //             key={i}
    //             texture={texture}
    //             x={variant.position}
    //             y={0}
    //             anchor={[0.5, 0]}
    //             height={100}
    //             tint="steelblue"
    //             alpha={0.8}
    //           />
    //         ))}
    //       </Container>
    //     );
    //   },
    //   onTick: wrapper => {  // to fix pixel width
    //     const xScale = wrapper.scale.x * wrapper.parent.scale.x;
    //     for (const rect of wrapper.children[0].children) {
    //       rect.width = variantWidth / xScale;
    //     }
    //   }
    // },