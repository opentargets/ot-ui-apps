import * as d3 from "d3";
import { useRef, useEffect } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { Box } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";

function Wrapper({ homologues, query, variables }) {
  const [ref, { width }] = useMeasure();
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "95%" }} ref={ref}>
        <Visualisation homologues={homologues} width={width} />
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

const jitter = () => Math.random() * 10;

function getConfigFromURL(searchParams, URLprops, sectionId) {
  const config = {};
  for (let i = 0; i < URLprops.length; i++) {
    config[URLprops[i]] = searchParams.get(sectionId + URLprops[i]);
  }
  return config;
}

function Visualisation({ homologues, width }) {
  const containerReference = useRef();

  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const sectionId = "compGenomics";
  const URLprops = ["ViewMode", "c", "a"];

  const viewModes = [
    "default",
    "mouseOrthologMaxIdentityPercentage",
    "paralogMaxIdentityPercentage",
  ];

  useEffect(() => {
    const config = getConfigFromURL(searchParams, URLprops, sectionId);

    console.log(config);

    const height = 400;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    const chartWidth = (width - marginRight) * 0.4;

    // Declare the x (horizontal position) scale.
    const queryScale = d3.scaleLinear().domain([0, 100]).range([marginLeft, chartWidth]);

    const targetScale = d3
      .scaleLinear()
      .domain([100, 0])
      .range([width - chartWidth, width - marginRight]);

    // Declare the y (vertical position) scale.

    const y = d3
      .scalePoint()
      .domain([
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
      ])
      .range([height - marginBottom * 2, marginTop]);

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
      .selectAll("query")
      .data(homologues)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return queryScale(d.queryPercentageIdentity);
      })
      .attr("cy", function (d) {
        return y(d.speciesId);
      })
      .attr("r", 5)
      .attr("fill-opacity", 0.5)
      .attr("fill", "#c2dcef")
      .attr("stroke", "#1a4565");

    targetContainer
      .selectAll("target")
      .data(homologues)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return targetScale(d.targetPercentageIdentity);
      })
      .attr("cy", function (d) {
        return y(d.speciesId);
      })
      .attr("r", 5)
      .attr("fill-opacity", 0.5)
      .attr("fill", "#c2dcef")
      .attr("stroke", "#1a4565");

    // Append the SVG element.
    containerReference.current.append(svg.node());
    return () => svg.remove();
  }, [homologues, width]);

  return <div ref={containerReference}></div>;
}
export default Wrapper;
