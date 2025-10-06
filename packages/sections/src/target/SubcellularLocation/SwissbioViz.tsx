import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { useConfigContext } from "ui";

function SwissBioVisSVG({ locationIds, taxonId, sourceId, hoveredCellPart, setHoveredCellPart}) {
  const { config } = useConfigContext();
  const wrapperRef = useRef();

  const basicHighlightStyles = {
    fill: config.profile.primaryColor,
    "fill-opacity": "0.3",
    stroke: config.profile.primaryColor,
  };

  const styleCellPart = (elmt, styles) => {
    for (const subElmt of elmt.querySelectorAll("*")) {
      for (const [key, value] of Object.entries(styles)) {
        subElmt.style.setProperty(key, value, "important");
      }
    }
  }

  // fetch svg, add style and event listeners and it to the DOM
  useEffect(() => {
    if (!wrapperRef.current) return;

    const fetchSVG = async () => {
      const response = await fetch(
        `https://www.swissbiopics.org//api/${taxonId}/sl/${locationIds}`
      );
      const svgString = await response.text();
      wrapperRef.current.innerHTML = svgString;
      const svg = wrapperRef.current.querySelector("svg");

      // all elements inside the SVG for which we have a location
      const subcellularPresentSVGs = svg.querySelectorAll(
        '.subcell_present, svg [class*="mp_"], svg [class*="part_"]'
      ) || [];

      for (const elmt of subcellularPresentSVGs) {
        let topLevelId = elmt.id.replace(/^[a-zA-Z]*/, "");
        elmt.addEventListener("mouseenter", () => setHoveredCellPart(topLevelId));
        elmt.addEventListener("mouseleave", () => setHoveredCellPart(null));
        styleCellPart(elmt, basicHighlightStyles);
      }
    }
    fetchSVG();
  }, [taxonId, sourceId, locationIds]);
  
  // hover updates
  useEffect(() => {
    if (!wrapperRef.current) return;
    
    const svg = wrapperRef.current.querySelector("svg");
    if (!svg) return;
    
    // remove existing hover highkight if exists
    for (const elmt of svg.querySelectorAll('.hovered')) {
      elmt.classList.remove('hovered');
      styleCellPart(elmt, basicHighlightStyles);
    }
    
    // add hover state to the current element if hoveredCellPart is set
    if (hoveredCellPart) {
      const targetElement = svg.querySelector(`#SL${hoveredCellPart}`);
      if (targetElement) {
        targetElement.classList.add('hovered');
        styleCellPart(targetElement, {
          fill: config.profile.primaryColor,
          "fill-opacity": "1",
          stroke: config.profile.primaryColor,
        });
      }
    }
  }, [hoveredCellPart]);

  return (
    <Box ref={wrapperRef} sx={{ flexGrow: 1, maxWidth: "600px" }} />
  );
}

export default SwissBioVisSVG;