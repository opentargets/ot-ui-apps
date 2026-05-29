import { useEffect, useRef } from "react";
import { scaleLinear, axisLeft, select } from "d3";
import { Box, Typography, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { DataSprite, DataText, DataHLine, DataBackground } from "../GenTrack";
import { Container } from '@pixi/react';
import { TextStyle } from 'pixi.js';
import YDetails from "./YDetails";
import { useGenTrackTooltipDispatch } from "ui";

const VARIANT_TRACK_HEIGHT = 67;
const H_LINE_COLOR = 0xdddddd;

function VariantsAxis() {
  const axisRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const scale = scaleLinear()
      .domain([1, 0])
      .range([0, VARIANT_TRACK_HEIGHT]);

    const axis = axisLeft(scale)
      .tickValues([0, 1])
      .tickFormat(d => String(d))
      .tickSizeOuter(0);

    if (!axisRef.current) return;
    const axisSelection = select(axisRef.current as SVGGElement).call(axis);

    axisSelection.selectAll("text")
      .style("font-size", "11px")
      .style("font-family", "'Inter', sans-serif");

    axisSelection.select(".domain")
      .style("stroke", grey[600])
      .style("stroke-width", "0")

    axisSelection.selectAll(".tick line")
      .style("stroke", grey[600])
  }, []);

  return (
    <svg width={24} height={VARIANT_TRACK_HEIGHT} style={{ overflow: "visible", flexShrink: 0 }}>
      <g ref={axisRef} transform="translate(24, 0)" />
    </svg>
  );
}

function VariantsYInfo() {
  return (
    <YDetails
      SubLabel={() => (
        <Box sx={{
          height: "100%",
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 0,
          mr: -3,
        }}>
          <Typography variant="caption" sx={{ textAlign: 'right' }}>
            Variants
          </Typography>
          <Typography variant="caption" sx={{ textAlign: 'right', fontSize: '11px' }}>
            posterior probability
          </Typography>
        </Box>
      )}
      Axis={VariantsAxis}
    />
  );
}

export function getVariantTrack({ data }: { data: any }) {
  const genTrackTooltipDispatch = useGenTrackTooltipDispatch() as unknown as (action: { type: string; value: any }) => void;

  return {
    id: `variants`,
    height: VARIANT_TRACK_HEIGHT,
    paddingTop: 14,
    yMin: 0,
    yMax: 1,
    YInfo: VariantsYInfo,
    Track: ({ trackId, scalesRef }: { trackId: string; scalesRef: any }) => {  
      const theme = useTheme();
      const primaryColor = theme.palette.primary.main;

      return (
        <Container>
          <DataBackground scalesRef={scalesRef} trackId={trackId} color="#e8f0fe" alpha={1} />
          {/* <DataHLine scalesRef={scalesRef} trackId={trackId} y={1} color={H_LINE_COLOR} /> */}
          {/* <DataHLine scalesRef={scalesRef} trackId={trackId} y={0.5} color={H_LINE_COLOR} /> */}
          {/* <DataHLine scalesRef={scalesRef} trackId={trackId} y={0} color={H_LINE_COLOR} /> */}
          
          {/* all variants */}
          {data?.locus.rows.map(({ variant, posteriorProbability }: { variant: any; posteriorProbability: number }) => {
            const isLead = variant.position === data.variant.position;
            return (
              <DataSprite
                key={variant.id}
                shape={isLead ? "circle" : "ring"}
                strokePixels={1.5}
                scalesRef={scalesRef}
                trackId="variants"
                x={variant.position}
                y={1 - posteriorProbability}
                radiusPixels={4}
                tint={primaryColor}
                eventMode="static"
                pointerover={(e: any) => {
                  genTrackTooltipDispatch({ type: "setDatum", value: variant });
                  genTrackTooltipDispatch({ type: "setGlobalXY", value: { x: e.global.x, y: e.global.y } });
                }}
                pointerout={() => {
                  genTrackTooltipDispatch({ type: "setDatum", value: null });
                  genTrackTooltipDispatch({ type: "setGlobalXY", value: null });
                }}
              />
            );
          })}

          {/* lead variant label */}
          {data?.variant && (
            <DataText
              scalesRef={scalesRef}
              trackId="variants"
              x={data.variant.position}
              y={1 - (data.locus.rows.find((r: any) => r.variant.position === data.variant.position)?.posteriorProbability ?? 0)}
              text="Lead"
              anchor={[0.5, 1.3]}
              style={new TextStyle({
                align: 'center',
                fill: "#000",
                fontSize: 10.5,
                fontWeight: '100',
                wordWrap: false,
              })}
            />
          )}
        </Container>
      );
    }
  };
}