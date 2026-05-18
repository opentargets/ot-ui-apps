import { useEffect, useRef } from "react";
import { scaleLinear, axisLeft, select } from "d3";
import { Box, Typography } from "@mui/material";
import { DataSprite, DataHLine } from "../GenTrack";
import { Container } from '@pixi/react';

const VARIANT_TRACK_HEIGHT = 60;
const H_LINE_COLOR = 0xdddddd;

const VARIANT_TRACK_PADDING_TOP = 24;
const VARIANT_AXIS_HEIGHT = VARIANT_TRACK_HEIGHT - VARIANT_TRACK_PADDING_TOP;

function VariantsYInfo() {
  const axisRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const scale = scaleLinear()
      .domain([1, 0])
      .range([0, VARIANT_AXIS_HEIGHT]);

    const axis = axisLeft(scale)
      .tickValues([0, 1])
      .tickFormat(d => String(d))
      .tickSizeOuter(0);

    if (!axisRef.current) return;
    const axisSelection = select(axisRef.current as SVGGElement).call(axis);

    axisSelection.selectAll("text")
      .style("font-size", "9px")
      .style("font-family", "'Inter', sans-serif");

    axisSelection.select(".domain")
      .style("stroke", "#000")
      .style("opacity", 0.3);

    axisSelection.selectAll(".tick line")
      .style("stroke", "#000")
      .style("opacity", 0.3);
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-start", pt: `${VARIANT_TRACK_PADDING_TOP}px` }}>
      <Typography
        variant="caption"
        sx={{ fontSize: "9px", color: "text.secondary", fontWeight: 500, lineHeight: 1.3, flex: 1, textAlign: "right", pr: 0.5 }}
      >
        Variants<br />(posterior<br />probability)
      </Typography>
      <svg width={24} height={VARIANT_AXIS_HEIGHT} style={{ overflow: "visible", flexShrink: 0 }}>
        <g ref={axisRef} transform="translate(24, 0)" />
      </svg>
    </Box>
  );
}

export function getVariantTrack({ data }: { data: any }) {

  return {
    id: `variants`,
    height: VARIANT_TRACK_HEIGHT,
    paddingTop: 24,
    yMin: 0,
    yMax: 1,
    YInfo: VariantsYInfo,
    Track: ({ trackId, scalesRef }) => {  

      return (
        <Container>
          <DataHLine scalesRef={scalesRef} trackId={trackId} y={1} color={H_LINE_COLOR} />
          
          {/* all variants */}
          {data?.locus.rows.map(({ variant, posteriorProbability }, i) => {
            const isLead = variant.position === data.variant.position;
            return (
              <DataSprite
                key={variant.id}
                shape="ring"
                strokePixels={1.5}
                scalesRef={scalesRef}
                trackId="variants"
                x={variant.position}
                y={1 - posteriorProbability}
                radiusPixels={5}
                tint={0x000000}
              />


              // <Sprite
              //   key={i}
              //   texture={isLead ? circleTexture : ringTexture}
              //   x={variant.position}
              //   y={50}
              //   anchor={[0.5, 0.5]}
              //   height={variantWidth / variantTrackHeight * 100}
              //   tint={0x000000}
              //   alpha={isLead ? 1 : 0.6}
              // />
            );
          })}

          {/* lead variant label */}
          {/* <Text
            text="Lead"
            x={data.variant.position}
            y={25}
            anchor={[0.5, 1]}
            style={
              new TextStyle({
                align: 'center',
                fill: labelColor,
                fontSize: 11,
                fontWeight: '100',
                wordWrap: false,
              })
            }
          /> */}
        </Container>
      );
    }
  };
}