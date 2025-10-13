import { Box, Skeleton } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useConfigContext } from "ui";

function SwissBioVisSVG({ locationIds, taxonId, sourceId, hoveredCellPart, setHoveredCellPart}) {
  const [loading, setLoading] = useState(true);
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

  // fetch SVG, add style and event listeners, add SVG to the DOM
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
        const topLevelId = (
          elmt.closest('.subcellular_present') ??
          elmt.closest('.subcellular_location')
        )?.id.replace(/^[a-zA-Z]*/, "");
        elmt.addEventListener("mouseover", (e) => {
          e.stopPropagation();
          setHoveredCellPart(topLevelId);
        });
        elmt.addEventListener("mouseout", (e) => {
          e.stopPropagation();
          setHoveredCellPart(null);
        });
        styleCellPart(elmt, basicHighlightStyles);
      }
      setLoading(false);
    }
    fetchSVG();
  }, [taxonId, sourceId, locationIds]);
  
  // hover updates
  useEffect(() => {

    if (!wrapperRef.current) return;
    
    const svg = wrapperRef.current.querySelector("svg");
    if (!svg) return;
    
    // remove existing hover highlight if exists
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
          "fill-opacity": "0.7",
          stroke: config.profile.primaryColor,
        });
      }
    }
  }, [hoveredCellPart]);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: "600px", display: "flex", flexDirection: "column", justifyContent: "start" }}>
      {loading && <Skeleton width="100%" height={400} />}
      <Box ref={wrapperRef} />
    </Box>
  );
}

export default SwissBioVisSVG;