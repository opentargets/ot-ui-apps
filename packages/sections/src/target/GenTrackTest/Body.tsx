import { useQuery } from "@apollo/client";
import { Container, Sprite, ParticleContainer } from '@pixi/react';
import { Box, Typography } from "@mui/material";
import {
  GenTrackProvider,
  GenTrack,
  SectionItem,
} from "ui";
import { definition } from ".";
import Description from "./Description";
import GEN_TRACK_TEST_QUERY from "./GenTrackTestQuery.gql";
import { Rectangle, useRectangleTexture, useCircleTexture } from "./shapes";
import Intro from "./Intro";

type BodyProps = {
	id: string;
	entity: string;
};

function randomRect({ xMin, xMax, yMin, yMax }) {
  const category = Math.floor(Math.random() * 20);
  return {
    x: Math.random() * (xMax - xMin) + xMin,
    y: category * 5,
    category,
    w: Math.random() * 2,
    h: 5,
  }
}

function Body({ id: ensemblId, entity }: BodyProps) {
  const variables = { ensemblId };
  const request = useQuery(GEN_TRACK_TEST_QUERY, {
    variables,
  });

  // generate some fake data for now
  const xMin = 200;
  const xMax = 700;
  const yMin = 0;
  const yMax = 100;
  const barInterval = (xMax - xMin) / 50;
  const data = {
    longRects: [
      { x1: 200, x2: 500, y1: 1, y2: 24 },
      { x1: 300, x2: 650, y1: 26, y2: 49 },
      { x1: 250, x2: 400, y1: 51, y2: 74 },
      { x1: 600, x2: 700, y1: 76, y2: 99 },
    ],
    shortRects: new Array(20_000).fill(0).map(() => randomRect({xMin, xMax, yMin, yMax})),
    bars: new Array(50).fill(1).map((_, i) => {
      const h = Math.random() * yMax;
      return {
        x: xMin + (i * barInterval),
        y: 100 - h,
        w: barInterval - 1,
        h,
      };
    }),
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

  const tracks = [
    { // use Grahoics objects for example with few rectangles
      id: `long-rectangles`,
      height: 60,
      yMin,
      yMax,
      YInfo: ({}) => (
        <Box sx={{ background: "#f0f0f0", width: "100%", height: "100%", p: 1 }}>
        <Typography variant="body2">
          <Box component="span" sx={{fontWeight: 600, pr: 2 }}>Domains</Box><br />
          <Box component="span" sx={{fontWeight: 300, }}>y-info</Box>
        </Typography>
        </Box>
      ),
      Track: () => (
        <Container>
          {data.longRects.map((d, i) => (
            <Rectangle
              key={i}
              x={d.x1}
              y={d.y1}
              width={d.x2 - d.x1}
              height={d.y2 - d.y1}
              color={colorScheme[i]}
              alpha={0.9}
            />
          ))}
        </Container>
      ),
    },
    { // use texture and particle container when a lot of rectangles
      id: `small-rectangles`,
      height: 120,
      yMin,
      yMax,
      YInfo: ({}) => (
        <Box sx={{ background: "#f0f0f0", width: "100%", height: "100%", p: 1 }}>
          <Typography variant="body2">
            <Box component="span" sx={{fontWeight: 600, pr: 2 }}>Segments</Box><br />
            <Box component="span" sx={{fontWeight: 300, }}>y-info</Box>
          </Typography>
        </Box>
      ),
      Track: () => {
        const rectTexture = useRectangleTexture();
        return (
          <ParticleContainer
            maxSize={data.shortRects.length}
            properties={{
              position: true,
              scale: true, // width/height maps to scale internally
              tint: true,
              alpha: true,
            }}
          >
            {data.shortRects.map((p, i) => (
              <Sprite
                key={i}
                texture={rectTexture}
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h}
                tint={colorScheme[p.category]}
                alpha={0.3}
              />
            ))}
          </ParticleContainer>
        );
      }
    },
    {
      id: `bar-chart`,
      height: 80,
      yMin,
      yMax,
      YInfo: ({}) => (
        <Box sx={{ background: "#f0f0f0", width: "100%", height: "100%", p: 1 }}>
        <Typography variant="body2">
          <Box component="span" sx={{fontWeight: 600, pr: 2 }}>Bars</Box><br />
          <Box component="span" sx={{fontWeight: 300, }}>y-info</Box>
        </Typography>
        </Box>
      ),
      Track: () => {
        const rectTexture = useRectangleTexture();
        return (
          <Container>
            {data.bars.map((p, i) => (
              <Sprite
                key={i}
                texture={rectTexture}
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h}
                tint={colorScheme[i % colorScheme.length]}
                alpha={0.6}
              />
            ))}
          </Container>
        );
      }
    },
  ];

  // need canvasWidth prop (even if not used) for correct behavior of inner XInfo
  function XInfo({start, end, canvasWidth}) {
    return (
      <Box sx={{ background: "#f0f0f0", width: "100%", height: "100%", p: 1, borderRadius: 2 }}>
        <Typography variant="body2">
          <Box component="span" sx={{fontWeight: 600, pr: 2 }}>x: {Math.round(start)}-{Math.round(end)}</Box>
          <Box component="span" sx={{fontWeight: 300, }}>x-info, e.g. axis</Box>
        </Typography>
      </Box>
    )
  }

	return (
		<SectionItem
			definition={definition}
			entity={entity}
			request={request}
			showContentLoading
			loadingMessage="Loading data. This may take some time..."
			renderDescription={() => (
				<Description />
			)}
			renderBody={() => {
				return (
          <GenTrackProvider
            initialState={{ data, xMin: 200, xMax: 700 }} 
          >
            <GenTrack
              XInfo={XInfo}
              tracks={tracks.slice(0, 2)}
              InnerXInfo={XInfo}
              innerTracks={tracks.slice(1)}
            />
            <Intro />
          </GenTrackProvider>
				);
			}}
		/>
	);
}

export default Body;
