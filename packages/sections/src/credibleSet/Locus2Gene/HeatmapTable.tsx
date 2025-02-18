import { useState } from "react";
import { interpolateRdBu, scaleDiverging, rgb } from "d3";
import { ObsPlot, DataDownloader, Link } from "ui";
import { Box, Typography, Popover, Button, Dialog } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartGantt,
  faChevronRight,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";

import { renderBarChart } from "./renderBarChart";
import { renderWaterfallPlot } from "./renderWaterfallPlot";
import HeatmapLegend from "./HeatmapLegend";
import { grey } from "@mui/material/colors";

function ChartControls({ data, query, variables, columns }) {
  return (
    <Box
      sx={{
        borderColor: grey[300],
        borderRadius: 1,
        display: "flex",
        justifyContent: "flex-end",
        gap: 1,
        mb: 2,
      }}
    >
      <DataDownloader
        btnLabel="Export"
        rows={data}
        query={query}
        variables={variables}
        columns={columns}
      />
    </Box>
  );
}

function HeatmapTable({ query, data, variables, columns, loading }) {
  if (loading) return null;
  const groupResults = getGroupResults(data.rows);
  const colorInterpolator = getColorInterpolator(groupResults);

  const theadElement = (
    <thead>
      <Box component="tr">
        <th></th>
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
        {["Gene", "Score", ...Object.keys(groupToFeature), "Base", ""].map((value, index) => (
          <HeaderCell key={index} value={value} textAlign={value === "Gene" ? "right" : "center"} />
        ))}
      </tr>
    </thead>
  );

  const tbodyElement = (
    <tbody>
      {groupResults.map(row => (
        <BodyRow data={data} key={row.geneId} rowData={row} colorInterpolator={colorInterpolator} />
      ))}
    </tbody>
  );

  return (
    <>
      <ChartControls query={query} data={data} variables={variables} columns={columns} />
      <Box display="flex" justifyContent="center">
        <Box
          component="table"
          sx={{
            tableLayout: "fixed",
            width: "90%",
            maxWidth: "1000px",
            borderCollapse: "collapse",
            my: 4,
          }}
        >
          <Box component="caption" sx={{ pt: 2, captionSide: "bottom", textAlign: "left" }}>
            <HeatmapLegend
              legendOptions={{
                // width: 700,
                // height: 100,
                color: {
                  type: "diverging",
                  interpolate: colorInterpolator,
                  domain: colorInterpolator.domain(),
                  range: [colorInterpolator.domain()[0], colorInterpolator.domain()[2]],
                },
              }}
            />
          </Box>
          {theadElement}
          {tbodyElement}
        </Box>
      </Box>
    </>
  );
}

export default HeatmapTable;

function BodyRow({ rowData: row, colorInterpolator, data }) {
  const [over, setOver] = useState(false);

  function handleMouseEnter(event) {
    setOver(true);
  }

  function handleMouseLeave(event) {
    setOver(false);
  }

  return (
    <tr key={row.targetId}>
      <CellWrapper
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        over={over}
      >
        <GeneCell value={row.targetSymbol} targetId={row.targetId} />
      </CellWrapper>
      <CellWrapper
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        over={over}
      >
        <ScoreCell value={row.totalL2GScore?.toFixed(3)} />
      </CellWrapper>
      {Object.keys(groupToFeature).map(groupName => {
        return (
          <CellWrapper
            key={row[groupName]}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            over={over}
          >
            <HeatCell
              data={data}
              value={row[groupName]?.toFixed(3)}
              geneId={row.targetId}
              groupName={groupName}
              bgrd={colorInterpolator(row[groupName])}
              mouseLeaveRow={handleMouseLeave}
            />
          </CellWrapper>
        );
      })}
      <CellWrapper
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        over={over}
      >
        <BaseCell value={row.shapBaseValue?.toFixed(3)} />
      </CellWrapper>
      <CellWrapper
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        over={over}
      >
        <FeatureChartCell
          geneId={row.targetId}
          mouseLeaveRow={handleMouseLeave}
          data={data}
          over={over}
        />
      </CellWrapper>
    </tr>
  );
}

function CellWrapper({ handleMouseEnter, handleMouseLeave, over, children }) {
  return (
    <Box
      component="td"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        p: "4px",
        bgcolor: over ? grey[100] : "transparent",
      }}
    >
      {children}
    </Box>
  );
}

function HeaderCell({ value, textAlign }) {
  return (
    <Box component="th" pt={1}>
      <Typography variant="subtitle2" textAlign={textAlign}>
        {value}
      </Typography>
    </Box>
  );
}

function GeneCell({ value, targetId }) {
  return (
    <Box display="flex" justifyContent="end">
      <Link asyncTooltip to={`/target/${targetId}`}>
        <Typography
          display="flex"
          justifyContent="center"
          alignItems="center"
          fontSize={14}
          textAlign="right"
        >
          {value}
        </Typography>
      </Link>
    </Box>
  );
}

function ScoreCell({ value }) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" borderRadius={1.5}>
      <Typography fontSize={14} sx={{ pointerEvents: "none" }}>
        {value}
      </Typography>
    </Box>
  );
}

function HeatCell({ value, bgrd, geneId, groupName, mouseLeaveRow, data }) {
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose(event) {
    setAnchorEl(null);
    mouseLeaveRow();
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Box
        aria-describedby={id}
        bgcolor={bgrd}
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius={1.5}
        py={1.4}
        onClick={handleClick}
        sx={{
          outline: anchorEl ? "2px solid #000" : "none",
          "&:hover": {
            outline: `2px solid #888`,
            cursor: "pointer",
          },
        }}
      >
        <Typography fontSize={13.5} color="#000" sx={{ pointerEvents: "none" }}>
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
            data={getTargetGroupFeatures(data, geneId, groupName)}
            otherData={{ featureNames: groupToFeature[groupName] }}
            minWidth={530}
            maxWidth={530}
            renderChart={renderBarChart}
          />
        </Box>
      </Popover>
    </>
  );
}

function BaseCell({ value }) {
  return (
    <Box
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius={1.5}
      py={1.4}
      outline="1px solid #e3e3e3"
    >
      <Typography fontSize={13.5} color="#ccc" sx={{ pointerEvents: "none" }}>
        {value}
      </Typography>
    </Box>
  );
}

function FeatureChartCell({ geneId, mouseLeaveRow, data, over }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    mouseLeaveRow();
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius={1.5}
        sx={{ opacity: over ? 1 : 0, transition: "all ease 100ms" }}
      >
        {/* <Button variant="outlined" onClick={handleClickOpen}>
          <FontAwesomeIcon icon={faChartGantt} />
        </Button> */}
        <Box
          sx={{
            // width: "30px",
            // height: "30px",
            // border: 1,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
          onClick={handleClickOpen}
        >
          <Typography variant="caption">Details</Typography>
          {/* <FontAwesomeIcon size="sm" icon={faUpRightAndDownLeftFromCenter} /> */}
          <FontAwesomeIcon size="sm" icon={faChevronRight} />
        </Box>
      </Box>
      <Dialog maxWidth="md" open={open} onClose={handleClose}>
        <Box sx={{ px: 3, py: 3 }}>
          <Typography variant="h6">
            Gene,{" "}
            <Box component="span" fontSize="0.85em">
              L2G score: X.XXX
            </Box>
          </Typography>
          <ObsPlot
            data={data.rows.find(d => d.target.id === geneId)}
            minWidth={600}
            maxWidth={600}
            renderChart={renderWaterfallPlot}
          />
        </Box>
      </Dialog>
    </>
  );
}

// ========== constants ==========

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
      targetId: d.target.id,
      targetSymbol: d.target.approvedSymbol,
      shapBaseValue: d.shapBaseValue,
      totalL2GScore: d.score,
    };
    for (const groupName of featureGroupNames) {
      row[groupName] = 0;
    }
    for (const feature of d.features) {
      row[featureToGroup[feature.name]] += feature.shapValue;
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

function getTargetGroupFeatures(data, targetId, groupName) {
  const row = data.rows.find(d => d.target.id === targetId);
  return row.features.filter(feature => featureToGroup[feature.name] === groupName);
}

function getColorInterpolator(groupResults) {
  let min = Infinity;
  let max = -Infinity;
  for (const row of groupResults) {
    for (const groupName of Object.keys(groupToFeature)) {
      min = Math.min(min, row[groupName]);
      max = Math.max(max, row[groupName]);
    }
  }
  Math.abs(min) > max ? (max = -min) : (min = -max);
  return scaleDiverging()
    .domain([min, 0, max])
    .interpolator(t => interpolateRdBu(t * 0.7 + 0.15));
}
