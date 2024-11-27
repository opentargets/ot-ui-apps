import * as d3 from "d3";
import { useRef, useEffect } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { Box, Typography, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Link } from "ui";

const VIEW_MODES = {
  default: "default",
  mouseOrthologMaxIdentityPercentage: "mouseOrthologMaxIdentityPercentage",
  paralogMaxIdentityPercentage: "paralogMaxIdentityPercentage",
};

const content = {
  mouseOrthologMaxIdentityPercentage:
    "The Mouse Ortholog Identity visualization highlights the maximum sequence identity (%) of mouse orthologs for a given target, providing insight into its potential for in vivo assays. Data is sourced from the Ensembl Compara widget, and only orthologs with at least 80% identity are considered. Scores range from 0 to 1, where 1 indicates a mouse gene with 100% identity to the target, and 0 means no gene meets the 80% threshold. If multiple orthologs exist, the highest identity percentage is displayed.",
  paralogMaxIdentityPercentage:
    "The Paralogues visualization displays the maximum sequence identity (%) of paralogues within the human genome, offering insights into functional redundancy or diversity. Data is sourced from the Ensembl Compara widget, focusing on paralogues with at least 60% identity to the target. Scores range from 0 to -1, where -1 represents paralogues with higher identity (≥60%), and 0 indicates paralogues with lower identity.",
};
const contentURL = {
  mouseOrthologMaxIdentityPercentage:
    "https://platform-docs.opentargets.org/target-prioritisation#mouse-ortholog-identity",
  paralogMaxIdentityPercentage:
    "https://platform-docs.opentargets.org/target-prioritisation#paralogues",
};

const yAxisValues = [
  "6239",
  "7227",
  "7955",
  "8364",
  "9823",
  "9615",
  "10141",
  "9986",
  "10116",
  "10090",
  "9544",
  "9598",
  "9606",
];

function Wrapper({ homologues, query, variables, viewMode }) {
  const [ref, { width }] = useMeasure();
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {viewMode !== "default" && (
        <Typography sx={{ width: "85%", my: 2, ml: 4 }} variant="body2">
          {content[viewMode]}
          <Link external to={contentURL[viewMode]}>
            Documentation
          </Link>
        </Typography>
      )}
      <Box sx={{ width: "95%", margin: "0 auto" }} ref={ref}>
        <Visualisation homologues={homologues} width={width} viewMode={viewMode} />
      </Box>
    </Box>
  );
}

const labels = {
  6239: "Caenorhabditis elegans (Nematode, N2)",
  7227: "Drosophila melanogaster (Fruit fly)",
  7955: "Zebrafish",
  8364: "Tropical clawed frog",
  9823: "Pig",
  9615: "Dog",
  10141: "Guinea Pig",
  9986: "Rabbit",
  10116: "Rat",
  10090: "Mouse",
  9544: "Macaque",
  9598: "Chimpanzee",
  9606: "Human",
};

function Visualisation({ homologues, width, viewMode }) {
  const theme = useTheme();
  const containerReference = useRef();
  const height = 400;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  // Declare the y (vertical position) scale.
  const y = d3
    .scalePoint()
    .domain(yAxisValues)
    .range([height - marginBottom * 2, marginTop]);

  useEffect(() => {
    const chartWidth = (width - marginRight) * 0.4;

    // Declare the x (horizontal position) scale.
    const queryScale = d3.scaleLinear().domain([0, 100]).range([marginLeft, chartWidth]);
    const targetScale = d3
      .scaleLinear()
      .domain([100, 0])
      .range([width - chartWidth, width - marginRight]);

    // Create the SVG container.
    const svg = d3.create("svg").attr("width", width).attr("height", height);

    // Add the x-axis.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(queryScale))
      .call(g =>
        g
          .append("text")
          .attr("x", marginLeft)
          .attr("y", marginBottom - 1)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("Query Percentage Identity →")
      );

    // Add the x-axis.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(targetScale))
      .call(g =>
        g
          .append("text")
          .attr("x", width - marginRight)
          .attr("y", marginBottom - 1)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text("← Target Percentage Identity")
      );

    const yAxis = d3
      .axisLeft(y)
      .tickFormat(d => labels[d])
      .tickSize(0);
    // Add the y-axis.
    svg
      .append("g")
      .attr("class", "queryContainer")
      .attr("transform", `translate(${width / 2},0)`)
      .style("text-anchor", "middle")
      .style("font-size", "0.85rem")
      .style("font-weight", 400)
      .call(yAxis)
      .call(g => g.select(".domain").remove());

    svg
      .append("g")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)
      .call(g =>
        g
          .append("g")
          .selectAll("line")
          .data(queryScale.ticks())
          .join("line")
          .attr("x1", d => queryScale(d))
          .attr("x2", d => queryScale(d))
          .attr("y1", marginTop)
          .attr("y2", height - marginBottom)
      )
      .call(g =>
        g
          .append("g")
          .selectAll("line")
          .data(targetScale.ticks())
          .join("line")
          .attr("x1", d => targetScale(d))
          .attr("x2", d => targetScale(d))
          .attr("y1", marginTop)
          .attr("y2", height - marginBottom)
      );

    // Create the grid
    const queryContainer = svg.append("g").attr("class", "queryContainer");
    const targetContainer = svg.append("g").attr("class", "targetContainer");

    queryContainer
      .selectAll(".query")
      .data(homologues)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return queryScale(d.queryPercentageIdentity);
      })
      .attr("cy", function (d) {
        return y(d.speciesId);
      })
      .attr("r", 6)
      .attr("fill-opacity", 0.7)
      .attr("fill", theme.palette.primary.main)
      .attr("stroke", theme.palette.primary.dark);

    targetContainer
      .selectAll(".target")
      .data(homologues)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return targetScale(d.targetPercentageIdentity);
      })
      .attr("cy", function (d) {
        return y(d.speciesId);
      })
      .attr("r", 6)
      .attr("fill-opacity", 0.7)
      .attr("fill", theme.palette.primary.main)
      .attr("stroke", theme.palette.primary.dark);

    if (viewMode === "mouseOrthologMaxIdentityPercentage") {
      targetContainer.selectAll("circle").attr("fill", grey[300]).attr("stroke", grey[300]);

      queryContainer
        .selectAll("circle")
        // .transition(300)
        .attr("fill", d =>
          d.queryPercentageIdentity > 80 && d.speciesId == "10090"
            ? theme.palette.primary.main
            : grey[300]
        )
        .attr("stroke", d =>
          d.queryPercentageIdentity > 80 && d.speciesId == "10090"
            ? theme.palette.primary.dark
            : grey[300]
        );
      queryContainer
        .append("line")
        .attr("x1", queryScale(80))
        .attr("x2", queryScale(80))
        .attr("y1", marginTop)
        .attr("y2", height - marginBottom)
        .attr("stroke", "#2e5943");

      svg
        .selectAll(".queryContainer text")
        .attr("color", d => (d === "10090" ? theme.palette.text.primary : grey[400]));
    }
    if (viewMode === "paralogMaxIdentityPercentage") {
      queryContainer.selectAll("circle").attr("fill", grey[300]).attr("stroke", grey[300]);

      targetContainer
        .selectAll("circle")
        // .transition(300)
        .attr("fill", d =>
          d.targetPercentageIdentity > 60 && d.speciesId == "9606"
            ? theme.palette.primary.main
            : grey[300]
        )
        .attr("stroke", d =>
          d.targetPercentageIdentity > 60 && d.speciesId == "9606"
            ? theme.palette.primary.dark
            : grey[300]
        );
      targetContainer
        .append("line")
        .attr("x1", targetScale(60))
        .attr("x2", targetScale(60))
        .attr("y1", marginTop)
        .attr("y2", height - marginBottom)
        .attr("stroke", "#e3a772");

      svg
        .selectAll(".queryContainer text")
        .attr("color", d => (d === "9606" ? theme.palette.text.primary : grey[400]));
    }

    // Append the SVG element.
    containerReference.current.append(svg.node());
    return () => svg.remove();
  }, [homologues, width, viewMode]);

  return <div ref={containerReference}></div>;
}
export default Wrapper;
