import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

function SwissBioVisSVG({ locationIds, taxonId, sourceId }) {

  const wrapperRef = useRef();

  // fetch the svg
  useEffect(() => {
    const fetchSVG = async () => {
      const response = await fetch(
        `https://www.swissbiopics.org//api/${taxonId}/sl/${locationIds}`
      );
      const svgString = await response.text();
      wrapperRef.current.innerHTML = svgString;
      const svg = wrapperRef.current.querySelector("svg");

      // this finds all subcellular location SVGs for which we have a location
      const subcellularPresentSVGs = svg.querySelectorAll(
        'svg .subcell_present, svg [class*="mp_"], svg [class*="part_"]'
      ) || [];

      for (const elmt of subcellularPresentSVGs) {
        elmt.style.setProperty("fill", "lime", "important");
        elmt.style.setProperty("fill-opacity", "1", "important");
        elmt.setAttribute("stroke", "cyan");

        // debugger

        // for (const subElmt of elmt.querySelectorAll("*")) {
     
        //   subElmt.style.setProperty("fill", "lime", "important");
        //   subElmt.style.setProperty("fill-opacity", "1", "important");
        //   subElmt.setAttribute("stroke", "cyan");
        // }
      }

    };
    fetchSVG();
  }, [taxonId, sourceId, locationIds]);
  
  return (
    <Box
      ref={wrapperRef}
      sx={{ flexGrow: 1, minWidth: "360px", maxWidth: "660px" }}
    />
  );
}


export default SwissBioVisSVG;