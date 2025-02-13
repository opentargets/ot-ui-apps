import { useState } from "react";
import * as PlotLib from "@observablehq/plot";
import { interpolateRdBu, schemeRdBu, scaleDiverging, rgb, sum } from "d3";
import { ObsPlot } from "ui";
import { Box, Typography, Popover } from "@mui/material";

const colorScheme = schemeRdBu;

function HeatmapTable() {
  const groupResults = getGroupResults(fakeData);

  const colorScale = getColorScale(groupResults);

  const theadElement = (
    <thead>
      <Box component="tr" sx={{}}>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <Box component="th" colSpan="3" sx={{ borderBottom: "1px solid #888", paddingBottom: 1 }}>
          <Typography variant="subtitle2">Colocalisation</Typography>
        </Box>
        <th></th>
        <th></th>
      </Box>
      <tr>
        {["Gene", "L2G score", ...Object.keys(groupToFeature), "Base"].map((value, index) => (
          <HeaderCell key={index} value={value} />
        ))}
      </tr>
    </thead>
  );

  const tbodyElement = (
    <tbody>
      {groupResults.map(row => (
        <tr key={row.geneId}>
          <GeneCell value={row.geneId} />
          <ScoreCell value={row.totalL2GScore?.toFixed(3)} />
          {Object.keys(groupToFeature).map(groupName => {
            return (
              <HeatCell
                key={row[groupName]}
                value={row[groupName]?.toFixed(3)}
                geneId={row.geneId}
                groupName={groupName}
                bgrd={colorScale(row[groupName])}
              />
            );
          })}
          <BaseCell value={row.shapBaseValue?.toFixed(3)} />
        </tr>
      ))}
    </tbody>
  );

  return (
    <Box display="flex" justifyContent="center">
      <Box
        component="table"
        sx={{
          tableLayout: "fixed",
          width: "90%",
          maxWidth: "1000px",
          borderCollapse: "separate",
          borderSpacing: "6px",
          my: 4,
        }}
      >
        {theadElement}
        {tbodyElement}
      </Box>
    </Box>
  );
}

export default HeatmapTable;

function HeaderCell({ value }) {
  return (
    <Box component="th" pt={1}>
      <Typography variant="subtitle2">{value}</Typography>
    </Box>
  );
}

function GeneCell({ value }) {
  return (
    <Box component="td">
      <Typography variant="caption" fontSize={13} textAlign="right">
        {value}
      </Typography>
    </Box>
  );
}

function HeatCell({ value, bgrd, geneId, groupName }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Box
        aria-describedby={id}
        component="td"
        bgcolor={bgrd}
        borderRadius={1.5}
        padding={1.5}
        onClick={handleClick}
        sx={{
          outline: anchorEl ? "2px solid #000" : "none",
          "&:hover": {
            outline: `2px solid #888`,
            cursor: "pointer",
          },
        }}
      >
        <Typography
          fontSize={13}
          color="#000"
          textAlign="center"
          width="100%"
          sx={{ pointerEvents: "none" }}
        >
          {value}
        </Typography>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        elevation={1}
        disableScrollLock
        transitionDuration={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          mt: 0.5,
        }}
      >
        <Box sx={{ px: 3, py: 2 }}>
          <ObsPlot
            data={getTargetGroupFeatures(geneId, groupName)}
            otherData={{ groupName }}
            minWidth={530}
            maxWidth={530}
            renderChart={renderPopoverChart}
          />
        </Box>
      </Popover>
    </>
  );
}

function BaseCell({ value }) {
  return (
    <Box component="td" borderRadius={1.5} padding={1.5} border="1px solid #bbb">
      <Typography
        fontSize={13}
        color="#777"
        textAlign="center"
        width="100%"
        sx={{ pointerEvents: "none" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function ScoreCell({ value }) {
  return (
    <Box component="td" borderRadius={1.5} padding={1.5}>
      <Typography
        fontSize={13}
        fontWeight={700}
        textAlign="center"
        width="100%"
        sx={{ pointerEvents: "none" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function renderPopoverChart({ data, otherData: { groupName }, width, height }) {
  const textInBarCutoff = 0.4; // hacky!
  const dxName = -70;
  const dxValue = -18;
  const dyHeader = -25;

  return PlotLib.plot({
    width,
    height,
    marginLeft: 310,
    marginRight: 10,
    marginTop: 30,
    marginBottom: 30,
    style: {
      fontSize: 12,
    },
    x: {
      domain: [-1, 1],
      label: null,
      ticks: [-1, 0, 1],
      tickFormat: Math.round,
    },
    y: {
      type: "band",
      domain: groupToFeature[groupName],
      label: "",
      tickSize: 0,
      grid: true,
      padding: 0.2,
      inset: 0.1,
      tickPadding: -dxName,
    },
    marks: [
      // x = 0 line
      PlotLib.ruleX([0], {
        strokeOpacity: 0.1,
      }),

      // column headers
      PlotLib.text(data.slice(0, 1), {
        x: -1,
        y: "name",
        dx: dxName,
        dy: dyHeader,
        text: d => "Feature",
        fontWeight: 500,
        textAnchor: "end",
      }),
      PlotLib.text(data.slice(0, 1), {
        x: -1,
        y: "name",
        dx: dxValue,
        dy: dyHeader,
        text: d => "Value",
        fontWeight: 500,
        textAnchor: "end",
      }),
      PlotLib.text(data.slice(0, 1), {
        x: 0,
        y: "name",
        dy: dyHeader,
        fontWeight: 500,
        text: d => `Shapley (sum: ${sum(data, d => +d.shapValue).toFixed(3)})`,
      }),

      // // text mark for y labels for flexibility
      // PlotLib.text(data, {
      //   x: -1,
      //   y: "name",
      //   textAnchor: "end",
      //   dx: dxName,
      //   // text: d => `${Number.isInteger(d.value) ? d.value : d.value.toFixed(3)} = ${d.name}`,
      //   text: d => d.name,
      // }),

      // feature values
      PlotLib.text(data, {
        x: -1,
        y: "name",
        text: "value",
        dx: dxValue,
        textAnchor: "end",
      }),

      // bars
      PlotLib.barX(data, {
        x: "shapValue",
        y: "name",
        fill: d => (d.shapValue < 0 ? negColor : posColor),
      }),

      // show nunbers in or next to bars
      PlotLib.text(
        data.filter(d => d.shapValue > textInBarCutoff),
        {
          x: "shapValue",
          y: "name",
          text: "shapValue",
          textAnchor: "end",
          fill: "#fff",
          dx: -4,
          fontSize: 11,
        }
      ),
      PlotLib.text(
        data.filter(d => d.shapValue < -textInBarCutoff),
        {
          x: "shapValue",
          y: "name",
          text: "shapValue",
          textAnchor: "start",
          fill: "#fff",
          dx: 4,
          fontSize: 11,
        }
      ),
      PlotLib.text(
        data.filter(d => d.shapValue > 0 && d.shapValue < textInBarCutoff),
        { x: "shapValue", y: "name", text: "shapValue", textAnchor: "start", dx: 4, fontSize: 11 }
      ),
      PlotLib.text(
        data.filter(d => d.shapValue < 0 && d.shapValue > -textInBarCutoff),
        { x: "shapValue", y: "name", text: "shapValue", textAnchor: "end", dx: -4, fontSize: 11 }
      ),
      // PlotLib.text(
      //   data.filter(d => d.shapValue === 0),
      //   { x: "shapValue", y: "name", text: "shapValue" }
      // ),
    ],
  });
}

// ========== constants ==========

const negColor = colorScheme.at(-1)[2];
const posColor = colorScheme.at(-1).at(-3);

const featureToGroup = {
  distanceSentinelFootprint: "Distance",
  distanceSentinelFootprintNeighbourhood: "Distance",
  distanceFootprintMean: "Distance",
  distanceFootprintMeanNeighbourhood: "Distance",
  distanceTssMean: "Distance",
  distanceTssMeanNeighbourhood: "Distance",
  distanceSentinelTss: "Distance",
  distanceSentinelTssNeighbourhood: "Distance",
  vepMaximum: "VEP",
  vepMaximumNeighbourhood: "VEP",
  vepMean: "VEP",
  vepMeanNeighbourhood: "VEP",
  eQtlColocClppMaximum: "eQTL",
  eQtlColocH4Maximum: "eQTL",
  eQtlColocClppMaximumNeighbourhood: "eQTL",
  eQtlColocH4MaximumNeighbourhood: "eQTL",
  pQtlColocH4MaximumNeighbourhood: "eQTL",
  pQtlColocClppMaximum: "pQTL",
  pQtlColocH4Maximum: "pQTL",
  pQtlColocClppMaximumNeighbourhood: "pQTL",
  sQtlColocClppMaximum: "sQTL",
  sQtlColocH4Maximum: "sQTL",
  sQtlColocClppMaximumNeighbourhood: "sQTL",
  sQtlColocH4MaximumNeighbourhood: "sQTL",
  geneCount500kb: "Other",
  proteinGeneCount500kb: "Other",
  credibleSetConfidence: "Other",
};

const groupToFeature = Object.groupBy(Object.entries(featureToGroup), ([feature, group]) => group);
for (const [groupName, group] of Object.entries(groupToFeature)) {
  groupToFeature[groupName] = group.map(arr => arr[0]);
}

// ========== helpers ==========

function getGroupResults(data) {
  const featureGroupNames = Object.keys(groupToFeature);
  const rows = data.map(d => {
    const row = {
      geneId: d.geneId,
      shapBaseValue: d.shapBaseValue,
      totalL2GScore: d.score,
    };
    for (const groupName of featureGroupNames) {
      row[groupName] = 0;
    }
    for (const feature of d.features) {
      row[featureToGroup[feature.name]] += +feature.shapValue;
    }
    return row;
  });
  rows.sort((a, b) => b.totalL2GScore - a.totalL2GScore);
  return rows;
}

export const PRIORITISATION_COLORS = [
  rgb("#a01813"),
  rgb("#bc3a19"),
  rgb("#d65a1f"),
  rgb("#e08145"),
  rgb("#e3a772"),
  rgb("#e6ca9c"),
  rgb("#eceada"),
  rgb("#c5d2c1"),
  rgb("#9ebaa8"),
  rgb("#78a290"),
  rgb("#528b78"),
  rgb("#2f735f"),
  rgb("#2e5943"),
];

function getTargetGroupFeatures(targetId, groupName) {
  const row = fakeData.find(d => d.geneId === targetId);
  return row.features.filter(feature => featureToGroup[feature.name] === groupName);
}

function getColorScale(groupResults) {
  let min = Infinity;
  let max = -Infinity;
  for (const row of groupResults) {
    for (const groupName of Object.keys(groupToFeature)) {
      min = Math.min(min, row[groupName]);
      max = Math.max(max, row[groupName]);
    }
  }
  Math.abs(min) > max ? (max = -min) : (min = -max);
  // hacky - avoid extreme colors
  min *= 1.3;
  max *= 1.3;
  return scaleDiverging(interpolateRdBu).domain([min, 0, max]);
}

////////////////////////////////////////////////////////////////////////////////
// FAKE DATA
////////////////////////////////////////////////////////////////////////////////

// 3 genes worth of fake data
const fakeData = JSON.parse(
  `[
    {
      "features": [
        {
          "name": "eQtlColocClppMaximum",
          "shapValue": 0,
          "value": 0.6295404212443838
        },
        {
          "name": "pQtlColocClppMaximum",
          "shapValue": 0.5383037593488115,
          "value": 0.06824977829590562
        },
        {
          "name": "sQtlColocClppMaximum",
          "shapValue": -0.14588385828659126,
          "value": 0.6862369999687776
        },
        {
          "name": "eQtlColocH4Maximum",
          "shapValue": 0,
          "value": 0.7550514665264757
        },
        {
          "name": "pQtlColocH4Maximum",
          "shapValue": 0.18665837187545167,
          "value": 0.4032837167010963
        },
        {
          "name": "sQtlColocH4Maximum",
          "shapValue": -0.9186885298682592,
          "value": 0.6323497242697477
        },
        {
          "name": "eQtlColocClppMaximumNeighbourhood",
          "shapValue": 0,
          "value": 0.23407736659645206
        },
        {
          "name": "pQtlColocClppMaximumNeighbourhood",
          "shapValue": 0.7482374713788128,
          "value": 0.4757271195576448
        },
        {
          "name": "sQtlColocClppMaximumNeighbourhood",
          "shapValue": 0.5292664833786639,
          "value": 0.9941802522947017
        },
        {
          "name": "eQtlColocH4MaximumNeighbourhood",
          "shapValue": 0,
          "value": 0.3222053051058792
        },
        {
          "name": "pQtlColocH4MaximumNeighbourhood",
          "shapValue": -0.01638497414786936,
          "value": 0.657148766450519
        },
        {
          "name": "sQtlColocH4MaximumNeighbourhood",
          "shapValue": -0.3886781550929305,
          "value": 0.3681475531362791
        },
        {
          "name": "distanceSentinelFootprint",
          "shapValue": 0,
          "value": 0.7879373546005921
        },
        {
          "name": "distanceSentinelFootprintNeighbourhood",
          "shapValue": -0.1319990099033858,
          "value": 0.7960550603947014
        },
        {
          "name": "distanceFootprintMean",
          "shapValue": 0.9843624087024754,
          "value": 0.11415942079406916
        },
        {
          "name": "distanceFootprintMeanNeighbourhood",
          "shapValue": 0,
          "value": 0.08743194886720485
        },
        {
          "name": "distanceTssMean",
          "shapValue": -0.0014657853999261016,
          "value": 0.32745410644182615
        },
        {
          "name": "distanceTssMeanNeighbourhood",
          "shapValue": -0.042082831074290956,
          "value": 0.3806518868596235
        },
        {
          "name": "distanceSentinelTss",
          "shapValue": 0,
          "value": 0.23823693079767738
        },
        {
          "name": "distanceSentinelTssNeighbourhood",
          "shapValue": 0.805042173197982,
          "value": 0.2736710066525825
        },
        {
          "name": "vepMaximum",
          "shapValue": -0.7345973008835576,
          "value": 0.12781039048933385
        },
        {
          "name": "vepMaximumNeighbourhood",
          "shapValue": 0,
          "value": 0.07580779079070166
        },
        {
          "name": "vepMean",
          "shapValue": -0.35813892464888236,
          "value": 0.8804981563098447
        },
        {
          "name": "vepMeanNeighbourhood",
          "shapValue": -0.3368768722500788,
          "value": 0.9760378125948922
        },
        {
          "name": "geneCount500kb",
          "shapValue": 0,
          "value": 0.31545019834528676
        },
        {
          "name": "proteinGeneCount500kb",
          "shapValue": 0.8826684221170858,
          "value": 0.5151024175517506
        },
        {
          "name": "credibleSetConfidence",
          "shapValue": -0.5048039376769136,
          "value": 0.29153643412262986
        }
      ],
      "geneId": "ENSG423557",
      "score": 0.33658222722159603,
      "shapBaseValue": 0.2,
      "studyLocusId": "SL_8013"
    },
    {
      "features": [
        {
          "name": "eQtlColocClppMaximum",
          "shapValue": 0,
          "value": 0.9557737452564872
        },
        {
          "name": "pQtlColocClppMaximum",
          "shapValue": -0.0443878798997026,
          "value": 0.8054746156254109
        },
        {
          "name": "sQtlColocClppMaximum",
          "shapValue": -0.009729982201301867,
          "value": 0.14790263905236367
        },
        {
          "name": "eQtlColocH4Maximum",
          "shapValue": 0,
          "value": 0.06611453852961013
        },
        {
          "name": "pQtlColocH4Maximum",
          "shapValue": -0.7720016424907377,
          "value": 0.46061708334786344
        },
        {
          "name": "sQtlColocH4Maximum",
          "shapValue": -0.8073762465732788,
          "value": 0.6801734333678756
        },
        {
          "name": "eQtlColocClppMaximumNeighbourhood",
          "shapValue": 0,
          "value": 0.8009294810822574
        },
        {
          "name": "pQtlColocClppMaximumNeighbourhood",
          "shapValue": -0.3157518099683416,
          "value": 0.5618460866412255
        },
        {
          "name": "sQtlColocClppMaximumNeighbourhood",
          "shapValue": 0.7341375450682524,
          "value": 0.7028894805885478
        },
        {
          "name": "eQtlColocH4MaximumNeighbourhood",
          "shapValue": 0,
          "value": 0.4941689699641272
        },
        {
          "name": "pQtlColocH4MaximumNeighbourhood",
          "shapValue": 0.4901219236039473,
          "value": 0.49239942089388533
        },
        {
          "name": "sQtlColocH4MaximumNeighbourhood",
          "shapValue": -0.5826853186033358,
          "value": 0.8650151704686329
        },
        {
          "name": "distanceSentinelFootprint",
          "shapValue": 0,
          "value": 0.9859141291124799
        },
        {
          "name": "distanceSentinelFootprintNeighbourhood",
          "shapValue": -0.0017698669580105126,
          "value": 0.10763164346376919
        },
        {
          "name": "distanceFootprintMean",
          "shapValue": 0.558472457675674,
          "value": 0.6127725354572723
        },
        {
          "name": "distanceFootprintMeanNeighbourhood",
          "shapValue": 0,
          "value": 0.04372204668818258
        },
        {
          "name": "distanceTssMean",
          "shapValue": 0.9580228698648886,
          "value": 0.1594536078683606
        },
        {
          "name": "distanceTssMeanNeighbourhood",
          "shapValue": 0.27010530987201914,
          "value": 0.7787458153814875
        },
        {
          "name": "distanceSentinelTss",
          "shapValue": 0,
          "value": 0.35983559368630036
        },
        {
          "name": "distanceSentinelTssNeighbourhood",
          "shapValue": 0.7054295835944236,
          "value": 0.31238345150090685
        },
        {
          "name": "vepMaximum",
          "shapValue": -0.1212731485618914,
          "value": 0.3267105210790824
        },
        {
          "name": "vepMaximumNeighbourhood",
          "shapValue": 0,
          "value": 0.5883677622754421
        },
        {
          "name": "vepMean",
          "shapValue": -0.48282682017909734,
          "value": 0.08848602716514953
        },
        {
          "name": "vepMeanNeighbourhood",
          "shapValue": -0.4721325795800218,
          "value": 0.469026812902131
        },
        {
          "name": "geneCount500kb",
          "shapValue": 0,
          "value": 0.3444298549079893
        },
        {
          "name": "proteinGeneCount500kb",
          "shapValue": -0.8019314497472464,
          "value": 0.4872694196530608
        },
        {
          "name": "credibleSetConfidence",
          "shapValue": -0.20539601116599085,
          "value": 0.4541778158004405
        }
      ],
      "geneId": "ENSG700224",
      "score": 0.3344897357434622,
      "shapBaseValue": 0.2,
      "studyLocusId": "SL_6408"
    },
    {
      "features": [
        {
          "name": "eQtlColocClppMaximum",
          "shapValue": 0,
          "value": 0.8715758522840282
        },
        {
          "name": "pQtlColocClppMaximum",
          "shapValue": -0.04393963820052156,
          "value": 0.40219204300610245
        },
        {
          "name": "sQtlColocClppMaximum",
          "shapValue": -0.0096163232912744,
          "value": 0.1854960260143692
        },
        {
          "name": "eQtlColocH4Maximum",
          "shapValue": 0,
          "value": 0.07691225220800779
        },
        {
          "name": "pQtlColocH4Maximum",
          "shapValue": 0.3812380750824416,
          "value": 0.09914943991093028
        },
        {
          "name": "sQtlColocH4Maximum",
          "shapValue": -0.8685428549538229,
          "value": 0.7649887739463108
        },
        {
          "name": "eQtlColocClppMaximumNeighbourhood",
          "shapValue": 0,
          "value": 0.9956606733684645
        },
        {
          "name": "pQtlColocClppMaximumNeighbourhood",
          "shapValue": 0.13796574524295366,
          "value": 0.19670280908153315
        },
        {
          "name": "sQtlColocClppMaximumNeighbourhood",
          "shapValue": 0.407768879111258,
          "value": 0.4634210643890394
        },
        {
          "name": "eQtlColocH4MaximumNeighbourhood",
          "shapValue": 0,
          "value": 0.7587875009118951
        },
        {
          "name": "pQtlColocH4MaximumNeighbourhood",
          "shapValue": 0.7771244392635253,
          "value": 0.9009261276780663
        },
        {
          "name": "sQtlColocH4MaximumNeighbourhood",
          "shapValue": -0.09425636428190523,
          "value": 0.9890082076749867
        },
        {
          "name": "distanceSentinelFootprint",
          "shapValue": 0,
          "value": 0.029700141591273876
        },
        {
          "name": "distanceSentinelFootprintNeighbourhood",
          "shapValue": 0.9558756472069141,
          "value": 0.31142839763394525
        },
        {
          "name": "distanceFootprintMean",
          "shapValue": -0.8590060268791719,
          "value": 0.48394465779338613
        },
        {
          "name": "distanceFootprintMeanNeighbourhood",
          "shapValue": 0,
          "value": 0.5358982288986963
        },
        {
          "name": "distanceTssMean",
          "shapValue": 0.9729902265020949,
          "value": 0.8190262637175857
        },
        {
          "name": "distanceTssMeanNeighbourhood",
          "shapValue": -0.03384215904870354,
          "value": 0.8631469475254717
        },
        {
          "name": "distanceSentinelTss",
          "shapValue": 0,
          "value": 0.9224696046171688
        },
        {
          "name": "distanceSentinelTssNeighbourhood",
          "shapValue": -0.30049611546552357,
          "value": 0.24575493404439197
        },
        {
          "name": "vepMaximum",
          "shapValue": -0.48131046194828486,
          "value": 0.5766186371621438
        },
        {
          "name": "vepMaximumNeighbourhood",
          "shapValue": 0,
          "value": 0.17677413726591618
        },
        {
          "name": "vepMean",
          "shapValue": 0.025125821286841585,
          "value": 0.3875582685233402
        },
        {
          "name": "vepMeanNeighbourhood",
          "shapValue": -0.5115948843940025,
          "value": 0.9443867930585176
        },
        {
          "name": "geneCount500kb",
          "shapValue": 0,
          "value": 0.021314032018475926
        },
        {
          "name": "proteinGeneCount500kb",
          "shapValue": 0.6219417506063534,
          "value": 0.3729764552132758
        },
        {
          "name": "credibleSetConfidence",
          "shapValue": 0.15954449400487714,
          "value": 0.016409454114058697
        }
      ],
      "geneId": "ENSG638684",
      "score": 0.33137552744544185,
      "shapBaseValue": 0.2,
      "studyLocusId": "SL_2448"
    }
  ]`
);
