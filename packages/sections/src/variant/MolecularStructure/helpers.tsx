import { max, interpolateInferno } from "d3";
import { Vector2 } from "3dmol";
import {
  getAlphaFoldConfidence,
  getAlphaFoldPathogenicityColor,
  aminoAcidLookup
} from "@ot/constants";

const sequentialColorFunction = interpolateInferno;

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
  switch (state.representBy) {
    case "cartoon":
      for (const atom of state.atomsByResi.get(resi)) {
        state.viewer.addSphere({
          center: {x: atom.x, y: atom.y, z: atom.z},
          radius: 1.15,
          color: getResiColor(state, resi),
          opacity: 0.7,
        });
      }
      break;
    case "both":
      state.viewer.setSurfaceMaterialStyle(
        state.viewer._globalSurfaceId,
        getGlobalSurfaceStyle(state, resi)
      );
      break;    
    case "surface":
      state.viewer.setSurfaceMaterialStyle(
        state.viewer._globalSurfaceId,
        getGlobalSurfaceStyle(state, resi)
      );
      break;
  }
}

function removeOnHover(state) {
  if (state.representBy === "cartoon") {
    state.viewer.removeAllShapes();
  } else {
    state.viewer.setSurfaceMaterialStyle(
      state.viewer._globalSurfaceId,
      getGlobalSurfaceStyle(state)
    );
  }
}

function getResiColor(state, resi) {
  switch (state.colorBy) {
    case "confidence": return getAlphaFoldConfidence(state.atomsByResi.get(resi)[0], "color");
    case "pathogenicity": return state.pathogenicityScores 
      ? getAlphaFoldPathogenicityColor(state.pathogenicityScores.get(resi))
      : "#ddd"
    case "sequential": return sequentialColorFunction(resi / state.nResidues);
    case "none": return "#ddd";
  }
}

export const drawAppearance = [
  // cartoon
  {
    style: state => ({
      cartoon: {
        hidden: state.representBy === "surface",
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

function getVariantSurfaceStyle(state) {
  return {
    visible: state.representBy !== "surface",
    color: variantColor,
    opacity: 1
  };
}

function getGlobalSurfaceStyle(state, highlightResi) {
  return {
    visible: state.representBy !== "cartoon",
    opacity: state.representBy === "both" ? 0.55 : 1,
    colorfunc: state.representBy === "both"
      ? atom => (state.variantResidues.has(atom.resi)
        ? variantColor
        : atom.resi === highlightResi
          ? getResiColor(state, atom.resi)
          : "#fff"
      )
      : atom => (state.variantResidues.has(atom.resi)
        ? variantColor
        : atom.resi === highlightResi
          ? clickColor
          : getResiColor(state, atom.resi)
        )
  };
}

export function drawHandler(state) {
  const { viewer } = state;
  const variantSurfaceStyle = getVariantSurfaceStyle(state);
  const globalSurfaceStyle = getGlobalSurfaceStyle(state);
  if (!viewer._variantSurfaceId) {  // first draw: create variant surface, global surface and variant label
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
      globalSurfaceStyle,
      {},
      undefined,
      undefined,
      () => {}
    );
    _viewer.addLabel(
      ` ${state.variantSummary} `,
      labelStyle,
      { resi: [...state.variantResidues][0] }
    );
  }
  viewer.setSurfaceMaterialStyle(viewer._variantSurfaceId, variantSurfaceStyle);
  viewer.setSurfaceMaterialStyle(viewer._globalSurfaceId, globalSurfaceStyle);
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
    selection: (state, resi) => ({ resi }),
    style: state => ({
      stick: { color: clickColor },
      sphere: { color: clickColor, radius: 0.6 }
      // stick: { colorfunc: atom => getResiColor(state, atom.resi) },
      // sphere: { colorfunc: atom => getResiColor(state, atom.resi), radius: 0.6 }
    }),
    addStyle: true,
    onApply: (state, resi) => {
      state.viewer._clickedLabelId = _viewer.addLabel(
        ` ${state.atomsByResi.get(resi)[0].resn} ${resi} `,
        labelStyle,
        { resi }
      );
    },
    leave: [
      drawAppearance[0],  // cartoon
      {
        ...drawAppearance[1],  // click spheres for hovering
        onApply: (state, resi) => {
         state.viewer.removeLabel(state.viewer._clickedLabelId);
        },
      },
    ],
  }
];

export function trackColor(state, resi) {
  if (!state.viewer) return;
  return getResiColor(state, resi);
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