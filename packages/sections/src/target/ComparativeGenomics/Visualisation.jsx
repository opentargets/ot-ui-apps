import * as d3 from "d3";
import { useRef, useEffect } from "react";
const labels = {
  "6239": "",
  "7227": "",
  "7955": "",
  "8364": "",
  "9823": "",
  "9615": "",
  "10141": "",
  "9986": "",
  "10116": "",
  "10090": "",
  "9544": "",
  "9598": "",
  "9606": "",
}

function Visualisation({ homologues }) {
  const containerReference = useRef();

  useEffect(() => {
    const width = 640;
    const height = 400;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    // Declare the x (horizontal position) scale.
    const queryScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([marginLeft, (width - marginRight) / 3]);

    const targetScale = d3
      .scaleLinear()
      .domain([100, 0])
      .range([marginLeft + (width - marginRight) / 1.5, width - marginRight]);

    // Declare the y (vertical position) scale.

    // "6239",
    // "7227",
    // "7955",
    // "8364",
    // "9823",
    // "9615",
    // "10141",
    // "9986",
    // "10116",
    // "10090",
    // "9544",
    // "9598",
    // "9606",

    // "Human",
    //   "Chimpanzee",
    //   "Macaque",
    //   "Mouse",
    //   "Rat",
    //   "Rabbit",
    //   "Guinea Pig",
    //   "Dog",
    //   "Pig",
    //   "Tropical clawed frog",
    //   "Zebrafish",
    //   "Drosophila melanogaster (Fruit fly)",
    //   "Caenorhabditis elegans (Nematode, N2)"

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
      .range([height - marginBottom*2, marginTop]);

    // Create the SVG container.
    const svg = d3.create("svg").attr("width", width).attr("height", height);

    // Add the x-axis.
    svg
      .append("g")
      .attr("transform", `translate(0,${height-marginBottom})`)
      .call(d3.axisBottom(queryScale))
      .call(g => g.append("text")
        .attr("x", marginLeft)
        .attr("y", marginBottom - 1)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("Query Percentage Identity →"));

    // Add the x-axis.
    svg
      .append("g")
      .attr("transform", `translate(0,${height-marginBottom})`)
      .call(d3.axisBottom(targetScale))
      .call(g => g.append("text")
        .attr("x", width-marginRight)
        .attr("y", marginBottom - 1)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text("← Target Percentage Identity"));


    const yAxis = d3.axisLeft(y).tickFormat((d) => labels[d])
    // Add the y-axis.
    svg
    .append("g")
    .attr("transform", `translate(${width / 2},0)`)
    .call(yAxis)
    .call(g => g.select(".domain").remove());

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
  }, [homologues]);

  return <div ref={containerReference}></div>;
}
export default Visualisation;
