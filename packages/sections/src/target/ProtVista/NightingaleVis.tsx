import { useEffect, useRef } from "react";
import "@nightingale-elements/nightingale-structure";

function NightingaleVis({ uniprotId }) {
  const visContainer = useRef(null);

  useEffect(() => {
    if (visContainer && customElements.whenDefined("nightingale-sequence")) {
      visContainer.current.data = uniprotId;
    }
  }, [uniprotId]);

  return (
    <nightingale-structure
      ref={visContainer}
      // structure-id={uniprotId}
      protein-accession="P05067"
      // structure-id="1AAP"
      structure-id="AF-P05067-F1"
      // hide-table
    ></nightingale-structure>
  );
}

export default NightingaleVis;
