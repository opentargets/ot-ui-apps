import { max, mean, schemeDark2, schemeSet1, schemeObservable10 } from "d3";
import { Vector2 } from "3dmol";
import {
  getAlphaFoldConfidence,
  getAlphaFoldPathogenicityColor,
  aminoAcidLookup,
  aminoAcidTypeLookup,
} from "@ot/constants";

const secondaryStructureColors = {
  h: "#008B8B",
  s: "#e6ab02", 
  c: "#c0c0c0",
}

export const domainColors = [
  ...[1, 2, 5, 0, 6].map(i => schemeDark2[i]),
  ...[1, 0, 4, 7].map(i => schemeSet1[i]),
  ...[0, 3, 6].map(i => schemeObservable10[i]),
];

const residueTypeColors = {
  acid: "#ff1744",
  basic: "#0044ff",
  nonpolar: "#ccc",
  polar: "#17eeee",
};

const variantColor = "lime";
const clickColor = "magenta";

const labelStyle =   {
  alignment: "center",
  screenOffset: new Vector2(28, -28),
  backgroundColor: "#fff",
  backgroundOpacity: 0.9,
  borderColor: "#999",
  borderThickness: 1.5,
  font: "'Inter', sans-serif",
  fontColor: "#000",
  fontSize: 12.6,
  inFront: true,
};

function showOnHover(state, resi) {
  let color, opacity, radius;
  switch (state.representBy) {
    case "cartoon":
      radius = 1.5;
      color = getResiColor(state, resi);
      opacity = 0.7;
      break;
    case "hybrid":
      radius = 1.5;
      color = getResiColor(state, resi);
      opacity = 1;
      break;
    case "transparent":
      radius = 1.5;
      color = getResiColor(state, resi);
      opacity = 1;
      break;
    case "opaque":
      radius = 2;
      color = clickColor;
      opacity = 1;
      break;
  }

  if (!state.variantResidues.has(resi) && resi !== state.viewer._clickedResi) {
    for (const atom of state.atomsByResi.get(resi)) {
      state.viewer.addSphere({
        center: {x: atom.x, y: atom.y, z: atom.z},
        radius,
        color,
        opacity,
      });
    }
  }
}

function removeOnHover(state) {
 state.viewer.removeAllShapes();
}

function getResiColor(state, resi) {
  switch (state.colorBy) {
    case "confidence": return getAlphaFoldConfidence(state.atomsByResi.get(resi)[0], "color");
    case "pathogenicity": return state.pathogenicityScores 
      ? getAlphaFoldPathogenicityColor(state.pathogenicityScores.get(resi))
      : "#ddd"
    case "domain": {
      if (!state.domains) return "#ddd";
      const domainIndex = state.domains.descriptionToIndex[state.domains.getDescription(resi)];
      return domainIndex == null
        ? "#ddd"
        : domainColors[domainIndex % domainColors.length];
    }
    case "secondary structure": return secondaryStructureColors[state.atomsByResi.get(resi)[0].ss];
    case "residue type": return residueTypeColors[aminoAcidTypeLookup[state.atomsByResi.get(resi)[0].resn]];
    case "none": return "#ddd";
  }
}

export const drawAppearance = [
  // cartoon
  {
    style: state => ({
      cartoon: {
        hidden: state.representBy === "opaque" || state.representBy === "transparent",
        colorfunc: atom => getResiColor(state, atom.resi),
        arrows: true,
      },
    }),
  },

  // variant hover spheres
  {
    selection: state => state.representBy === "cartoon"
      ? { resi: [...state.variantResidues] }
      : {},  // every atom has a hover sphere when show global surface
    style: { clicksphere: { radius: 1.5 } },
    addStyle: true,
  },
];

const variantSurfaceStyle = {
  color: variantColor,
  opacity: 1,
};

const clickSurfaceStyle = {
  color: clickColor,
  opacity: 1,
};

function getGlobalSurfaceStyle(state, highlightResi) {
  return {
    visible: state.representBy !== "cartoon",
    opacity: state.representBy === "opaque" ? 1 : "transparent" ? 0.65 : 0.55,
    colorfunc: state.representBy === "hybrid"
      ? atom => (state.variantResidues.has(atom.resi)
        ? variantColor
        : atom.resi === state.viewer._clickedResi 
          ? clickColor
          : atom.resi === highlightResi
            ? getResiColor(state, atom.resi)
            : "#fff"
      )
      : atom => (state.variantResidues.has(atom.resi)
        ? variantColor
        : atom.resi === highlightResi || atom.resi === state.viewer._clickedResi
          ? clickColor
          : getResiColor(state, atom.resi)
        )
  };
}

function updateGlobalSurface(state, highlightResi) {
  state.viewer.setSurfaceMaterialStyle(
    state.viewer._globalSurfaceId,
    getGlobalSurfaceStyle(state, highlightResi)
  );
}

export function drawHandler(state) {
  const { viewer } = state;
  if (!viewer._variantSurfaceId) {  // first draw: create surfaces and labels
    viewer._variantSurfaceId = viewer.addSurface(
      "VDW",
      variantSurfaceStyle,
      { resi: [...state.variantResidues] },
      undefined,
      undefined,
      () => {} // include surface callback so addSurface returns surface id synchronously
    );
    viewer._globalSurfaceId = viewer.addSurface(
      "VDW",
      getGlobalSurfaceStyle(state),
      {},
      undefined,
      undefined,
      () => {}
    );
    viewer.addLabel(
      ` ${state.variantSummary} `,
      labelStyle,
      { resi: [...state.variantResidues][0] }
    );
  }
  viewer.setSurfaceMaterialStyle(viewer._variantSurfaceId, variantSurfaceStyle);
  updateGlobalSurface(state);
}

export const hoverAppearance = [
  {
    selection: { atom: "CA"},
    onApply: showOnHover,
    leave: [{ onApply: removeOnHover}],
  }
];

export const clickAppearance = [
  {
    onApply: (state, resi) => {
      const { viewer } = state;
      viewer._clickedSurfaceId = viewer.addSurface(
        "VDW",
        clickSurfaceStyle,
        { resi },
        undefined,
        undefined,
        () => {}
      );
      viewer._clickedResi = resi;  // hack so can access when hovering
      viewer._clickedLabelId = viewer.addLabel(
        ` ${state.atomsByResi.get(resi)[0].resn} ${resi} `,
        labelStyle,
        { resi }
      );
      if (state.representBy !== "cartoon") updateGlobalSurface(state);
    },
    leave: [
      drawAppearance[0],  // cartoon
      {
        ...drawAppearance[1],  // click spheres for hovering
        onApply: (state, resi) => {
         state.viewer.removeSurface(state.viewer._clickedSurfaceId);
         state.viewer._clickedSurfaceId = null;
         state.viewer.removeLabel(state.viewer._clickedLabelId);
         state.viewer._clickedLabelId = null;
         state.viewer._clickedResi = null;
         if (state.representBy !== "cartoon") updateGlobalSurface(state);
        },
      },
    ],
  }
];

export function trackColor(state, resi) {
  if (!state.viewer) return;
  return getResiColor(state, resi);
}

export function trackTicks(state) {
  return [
    {
      resi: state.variantResidues.values().next().value,
      label: state.variantSummary,
    }
  ];
}

// after load data into viewer, check variant's reference amino acid matches
// amino acid at same position in structure data
export function dataHandler(viewer, dispatch, row) {
  const allAtoms = viewer.getModel().selectedAtoms();
  dispatch({
    type: "setNResidues",
    value: max(allAtoms, atom => atom.resi),
  });
  const structureReferenceAminoAcid = 
    allAtoms.find(atom => atom.resi === row.aminoAcidPosition)?.resn;
  if (aminoAcidLookup[row.referenceAminoAcid[0]] !== structureReferenceAminoAcid) {
    dispatch({
      type: "setMessage",
      value: "AlphaFold structure not available",
    });
  }
}

// OLD /////////////////////////////////////////////////////////////////////////

export function resetViewer(viewer, variantResidues, duration = 0) {
  let cx = 0,
    cy = 0,
    cz = 0;
  const residueAtoms = viewer.getModel().selectedAtoms({ resi: [...variantResidues] });
  for (let atom of residueAtoms) {
    cx += atom.x;
    cy += atom.y;
    cz += atom.z;
  }
  cx /= residueAtoms.length;
  cy /= residueAtoms.length;
  cz /= residueAtoms.length;
  viewer.zoomTo({ resi: [...variantResidues] }, duration);
}