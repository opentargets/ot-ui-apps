import { useState } from "react";
import { scaleLinear, scaleDiverging, rgb, extent, mean, interpolateRgbBasis, hsl } from "d3";
import { ObsPlot, DataDownloader, Link } from "ui";
import { Box, Typography, Popover, Dialog } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { renderWaterfallPlot } from "./renderWaterfallPlot";
import HeatmapLegend from "./HeatmapLegend";
import { grey } from "@mui/material/colors";

// processing for waterfall plots
const waterfallMaxWidth = 600;
const waterfallMargins = {
  left: 344,
  right: 40,
  top: 32,
  bottom: 36,
};
const waterfallMaxCanvasWidth = waterfallMaxWidth - waterfallMargins.left - waterfallMargins.right;

function computeWaterfall(originalRow, fullXDomain, zeroBase) {
  const row = structuredClone(originalRow);
  const { features } = row;
  features.sort((a, b) => Math.abs(a.shapValue) - Math.abs(b.shapValue));
  for (const [index, feature] of features.entries()) {
    feature._start = features[index - 1]?._end ?? (zeroBase ? 0 : row.shapBaseValue);
    feature._end = feature._start + feature.shapValue;
  }
  const xExtent = extent(features.map(d => [d._start, d._end]).flat());
  if (fullXDomain) {
    const relativeSize = (xExtent[1] - xExtent[0]) / (fullXDomain[1] - fullXDomain[0]);
    if (relativeSize < 0.25) {
      const middle = mean(xExtent);
      const stretch = 0.25 / relativeSize;
      xExtent[0] = middle + (xExtent[0] - middle) * stretch;
      xExtent[1] = middle + (xExtent[1] - middle) * stretch;
    }
  }
  const xDomain = scaleLinear().domain(xExtent).nice().domain();
  return { row, xDomain };
}

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

function HeatmapTable({ query, data, variables, loading }) {
  if (loading) return null;

  const groupResults = getGroupResults(data.rows);
  const colorInterpolator = getColorInterpolator(groupResults);
  const twoElementDomain = [colorInterpolator.domain()[0], colorInterpolator.domain()[2]];

  const columns = [
    { id: "targetSymbol", label: "gene" },
    { id: "score" },
    { id: "Distance" },
    { id: "VEP" },
    { id: "eQTL" },
    { id: "pQTL" },
    { id: "sQTL" },
    { id: "Other" },
    { id: "shapBaseValue", label: "base" },
  ];

  const theadElement = (
    <thead>
      <Box component="tr">
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <Box component="th" colSpan="3" sx={{ borderBottom: "1px solid #888", paddingBottom: 1 }}>
          <Typography variant="subtitle2">Colocalisation</Typography>
        </Box>
        <th></th>
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
        <BodyRow
          data={data}
          key={row.targetId}
          rowData={row}
          colorInterpolator={colorInterpolator}
        />
      ))}
    </tbody>
  );

  return (
    <>
      {/* <ChartControls query={query} data={data} variables={variables} columns={columns} /> */}
      <ChartControls query={query} data={groupResults} variables={variables} columns={columns} />
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
          <Box component="caption" sx={{ pt: 3, captionSide: "bottom", textAlign: "left" }}>
            <HeatmapLegend
              legendOptions={{
                color: {
                  type: "diverging",
                  interpolate: colorInterpolator,
                  domain: twoElementDomain,
                  range: twoElementDomain,
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

  const { row: waterfallRow, xDomain: waterfallXDomain } = computeWaterfall(
    data.rows.find(d => d.target.id === row.targetId)
  );

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
        <ScoreCell value={row.score?.toFixed(3)} />
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
              value={row[groupName]?.toFixed(3)}
              groupName={groupName}
              bgrd={colorInterpolator(row[groupName])}
              mouseLeaveRow={handleMouseLeave}
              waterfallRow={waterfallRow}
              waterfallXDomain={waterfallXDomain}
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
        <DetailCell
          geneSymbol={row.targetSymbol}
          score={row.score.toFixed(3)}
          mouseLeaveRow={handleMouseLeave}
          waterfallRow={waterfallRow}
          waterfallXDomain={waterfallXDomain}
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

function HeatCell({
  value,
  bgrd,
  groupName,
  mouseLeaveRow,
  waterfallRow,
  waterfallXDomain, // for row
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [plotProps, setPlotProps] = useState(null);

  function handleClick(event) {
    const filteredWaterfallRow = structuredClone(waterfallRow);
    filteredWaterfallRow.features = filteredWaterfallRow.features.filter(d => {
      return featureToGroup[d.name] === groupName;
    });
    const { row, xDomain } = computeWaterfall(filteredWaterfallRow, waterfallXDomain, true);
    const plotWidth =
      waterfallMargins.left +
      waterfallMargins.right +
      (waterfallMaxCanvasWidth * (xDomain[1] - xDomain[0])) /
        (waterfallXDomain[1] - waterfallXDomain[0]);
    let xTicks;
    const xRange = xDomain[1] - xDomain[0];
    if (xDomain.includes(0)) xTicks = xDomain;
    else if (Math.abs(xDomain[0]) < xRange / 4) xTicks = [0, xDomain[1]];
    else if (Math.abs(xDomain[1]) < xRange / 4) xTicks = [xDomain[0], 0];
    else xTicks = [...xDomain, 0];
    setPlotProps({
      data: row,
      otherData: { margins: waterfallMargins, xDomain, xTicks },
      minWidth: plotWidth,
      maxWidth: plotWidth,
      renderChart: renderWaterfallPlot,
    });
    setAnchorEl(event.currentTarget);
  }

  function handleClose(event) {
    setAnchorEl(null);
    mouseLeaveRow();
  }

  const open = Boolean(anchorEl);
  const id = open ? "plot-popover" : undefined;

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
            outline: `2px solid ${grey[600]}`,
            cursor: "pointer",
          },
        }}
      >
        <Typography
          fontSize={13.5}
          sx={{
            color: hsl(bgrd).l < 0.6 ? "#fff" : "#000",
            pointerEvents: "none",
          }}
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
        <ClosePlot handleClose={handleClose} />
        <Box sx={{ px: 3, pt: 3.5, pb: 2 }}>
          <ObsPlot {...plotProps} />
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

function DetailCell({ geneSymbol, score, mouseLeaveRow, waterfallRow, waterfallXDomain, over }) {
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
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            padding: 1,
            borderRadius: "0.4em",
            "&:hover": {
              backgroundColor: "#fff",
            },
          }}
          onClick={handleClickOpen}
        >
          <Typography variant="caption">Details</Typography>
          <FontAwesomeIcon size="sm" icon={faChevronRight} />
        </Box>
      </Box>
      <Dialog maxWidth="md" open={open} onClose={handleClose}>
        <ClosePlot handleClose={handleClose} />
        <Box sx={{ px: 3, py: 3 }}>
          <Typography variant="h6">
            {geneSymbol},{" "}
            <Box component="span" fontSize="0.9em">
              score: {score}
            </Box>
          </Typography>
          <ObsPlot
            data={waterfallRow}
            otherData={{ margins: waterfallMargins, xDomain: waterfallXDomain, labelBase: true }}
            minWidth={waterfallMaxWidth}
            maxWidth={waterfallMaxWidth}
            renderChart={renderWaterfallPlot}
          />
        </Box>
      </Dialog>
    </>
  );
}

function ClosePlot({ handleClose }) {
  return (
    <Box
      onClick={handleClose}
      width="36px"
      height="36px"
      position="absolute"
      top={0}
      right={0}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        "&:hover": {
          bgcolor: grey[100],
        },
      }}
    >
      <FontAwesomeIcon icon={faXmark} />
    </Box>
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
  pQtlColocH4MaximumNeighbourhood: "pQTL",
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
      score: d.score,
    };
    for (const groupName of featureGroupNames) {
      row[groupName] = 0;
    }
    for (const feature of d.features) {
      row[featureToGroup[feature.name]] += feature.shapValue;
    }
    return row;
  });
  rows.sort((a, b) => b.score - a.score);
  return rows;
}

export const DIVERGING_COLORS = [
  rgb("#a01813"),
  rgb("#bc3a19"),
  rgb("#e08145"),
  rgb("#e3a772"),
  rgb("#e6ca9c"),
  rgb("#f2f2f2"),
  rgb("#c5d2c1"),
  rgb("#9ebaa8"),
  rgb("#78a290"),
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
  return scaleDiverging().domain([min, 0, max]).interpolator(interpolateRgbBasis(DIVERGING_COLORS));
}
