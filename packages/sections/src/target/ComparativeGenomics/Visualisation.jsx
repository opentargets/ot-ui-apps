import * as d3 from "d3";
import { useRef, useEffect } from "react";

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
      .range([marginLeft, (width - marginRight) / 2]);

    const targetScale = d3
      .scaleLinear()
      .domain([100, 0])
      .range([marginLeft + (width - marginRight) / 2, width - marginRight]);

    // Declare the y (vertical position) scale.

    const y = d3
      .scalePoint()
      .domain([
        "9598",
        "10116",
        "9606",
        "8364",
        "9615",
        "7227",
        "9986",
        "9544",
        "9823",
        "6239",
        "7955",
        "10141",
        "10090",
      ])
      .range([height - marginBottom, marginTop]);

    // Create the SVG container.
    const svg = d3.create("svg").attr("width", width).attr("height", height);

    // Add the x-axis.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(queryScale));

    // Add the x-axis.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(targetScale));

    // Add the y-axis.
    svg.append("g").attr("transform", `translate(${marginLeft},0)`).call(d3.axisLeft(y));

    const queryContainer = svg.append("g").attr("class", "queryContainer");
    const targetContainer = svg.append("g").attr("class", "targuetContainer");

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
      .attr("r", 7)
      .attr("fill-opacity", 0.5)
      .attr("fill", "#666")
      .attr("stroke", "#2c2c2c");

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
      .attr("r", 7)
      .attr("fill-opacity", 0.5)
      .attr("fill", "#666")
      .attr("stroke", "#2c2c2c");

    // Append the SVG element.
    containerReference.current.append(svg.node());
  }, [homologues]);

  return <div ref={containerReference}></div>;
}
export default Visualisation;
