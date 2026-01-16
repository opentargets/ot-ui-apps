
import {
  GenTrack,
  useGenTrackState,
  useGenTrackTooltipDispatch,
  useGenTrackTooltipState
} from "ui";
import { Container, Sprite, ParticleContainer } from '@pixi/react';
import { Box, Typography } from "@mui/material";
import { useRectangleTexture } from "ui/src/components/GenTrack/shapes";

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

  
// need canvasWidth prop (even if not used) for correct behavior of inner XInfo
function XInfo({start, end, canvasWidth}) {
  return (
    <Box sx={{ background: "#f0f0f0", width: "100%", height: "100%", p: 1, borderRadius: 2 }}>
      <Typography variant="body2">
        <Box component="span" sx={{fontWeight: 600, pr: 2 }}>x: {Math.round(start)}-{Math.round(end)}</Box>
      </Typography>
    </Box>
  )
}

function BodyContentInner({ data }) {

  const genTrackState = useGenTrackState();
  const { xMin, xMax } = genTrackState; 

  const genTrackTooltipDispatch = useGenTrackTooltipDispatch();

  const tracks = [
    {
      id: `variants`,
      height: 30,
      paddingTop: 16,
      yMin: 0,
      yMax: 100,
      YInfo: ({}) => (
        <Box sx={{ background: "#f0f0f0", width: "100%", height: "100%", p: 1 }}>
        <Typography variant="body2">
          <Box component="span" sx={{fontWeight: 600, pr: 2 }}>Variants</Box><br />
        </Typography>
        </Box>
      ),
      Track: () => {
        const rectTexture = useRectangleTexture();
        return (
          <Container>
            {data.locus.rows.map(({ variant }, i) => (
              <Sprite
                key={i}
                texture={rectTexture}
                x={variant.position}
                y={0}
                width={(xMax - xMin) / 200}
                height={100}
                tint="steelblue"
                alpha={0.8}
              />
            ))}
          </Container>
        );
      }
    },
  ];

  return (
    <>
      <GenTrack
        XInfo={XInfo}
        tracks={tracks}
        InnerXInfo={XInfo}
        innerTracks={tracks}
        zoomLines
      />
      {/* <Intro /> */}
    </>
  );
}

export default BodyContentInner