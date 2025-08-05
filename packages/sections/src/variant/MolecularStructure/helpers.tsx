import { max, interpolateTurbo } from "d3";
import {
  getAlphaFoldConfidence,
  getAlphaFoldPathogenicityColor,
  aminoAcidLookup
} from "@ot/constants";

const sequentialColorFunction = interpolateTurbo;

function showOnHover(state, resi, interactionState, interactionDispatch) {
  if (state.showGlobalSurface) {
    state.viewer._hoverSurface = state.viewer.addSurface(
      "VDW",
      { opacity: 1, color: "#fff" },
      { resi },
      undefined,
      undefined,
      () => {} // include surface callback so addSurface returns surface id synchronously
    );
  } else {
    state.atomsByResi.get(resi).map(atom => {
      return state.viewer.addSphere({
        center: {x: atom.x, y: atom.y, z: atom.z},
        radius: 1.2,
        color: '#bbb',
        opacity: 0.6,
      });
    });
  }
}

function removeOnHover(state, resi, interactionState, interactionDispatch) {
  if (state.showGlobalSurface) {
    if (state.viewer._hoverSurface) {
      state.viewer.removeSurface(state.viewer._hoverSurface);
    }
  } else {
    state.viewer.removeAllShapes();
  }
}

export const drawAppearance = [
  {
    style: (state) => {
      let cartoon;
      switch (state.colorBy) {
        case "confidence":
          cartoon = { 
            colorfunc: a => getAlphaFoldConfidence(a, "color"),
          };
          break;
        case "pathogenicity":
          cartoon = { 
            colorfunc: state.pathogenicityScores 
             ? a => getAlphaFoldPathogenicityColor(state.pathogenicityScores.get(a.resi))
             : a => "green"
          };
          break;
        case "sequential":
          cartoon = { 
            colorfunc: a => sequentialColorFunction(a.resi / state.nResidues)
          };
          break;
      }
      cartoon.arrows = true;
      return { cartoon };
    },
  },
  // add clickspheres to variant residues so variant surface seems hoverable
  {
    selection: state => ({ resi: [...state.variantResidues]}),
    style: { clicksphere: { radius: 1.5 } },
    addStyle: true,
  }
];

export const hoverAppearance = [
  {
    onApply: showOnHover,
    leaveOnApply: removeOnHover,
  }
];

export const clickAppearance = [
  {
    selection: (state, resi) => ({ resi }),
    style: { stick: { hidden: false }, sphere: { radius: 0.6, hidden: false } },
    addStyle: true,
    leaveSelection: {},
    leaveStyle: drawAppearance[0].style,
  }
];

export function trackColor(state, resi) {
  if (!state.viewer) return;
  switch (state.colorBy) {
    case "confidence":
      return getAlphaFoldConfidence(state.atomsByResi.get(resi)[0], "color");
    case "pathogenicity":
      return state.pathogenicityScores
        ? getAlphaFoldPathogenicityColor(state.pathogenicityScores.get(resi))
        : "green"
    case "sequential":
      return sequentialColorFunction(resi / state.nResidues);
  }
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

// draw the variant surface after a redraw
export function drawHandler(state) {
  const { viewer, colorBy, variantPathogenicityScore } = state;
  const color = colorBy === "confidence"
    ? "lime"
    : colorBy === "pathogenicity"
      ? (variantPathogenicityScore
          ? getAlphaFoldPathogenicityColor(variantPathogenicityScore)
          : "lime"
        )
      : "lime";
  viewer._variantSurfaceId = viewer.addSurface(
    "VDW",
    { opacity: 1, color },
    { resi: [...state.variantResidues] },
    undefined,
    undefined,
    () => {} // include surface callback so addSurface returns surface id synchronously
  );
  if (state.showGlobalSurface) {
    viewer._globalSurface = 
      viewer.addSurface("VDW", { opacity: 0.55, color: "#fff" }, {}, undefined, undefined, () => {});
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



export function drawCartoon({ viewer, colorBy, pathogenicityScores, variantResidues }) {
  const colorfunc = !colorBy
    ? () => "#ccc"
    : colorBy === "confidence"
    ? a => getAlphaFoldConfidence(a, "color")
    : a => getAlphaFoldPathogenicityColor(a, pathogenicityScores);
  viewer.setStyle({}, { cartoon: { colorfunc, opacity: 1, arrows: true } });

  // add clickspheres so surface seems hoverable
  viewer.addStyle({ resi: [...variantResidues] }, { clicksphere: { radius: 1.5 } });
}

export function drawVariantSurface({ viewer, variantResidues, color }) {
  if (viewer._variantSurfaceId) viewer.removeSurface(viewer._variantSurfaceId);
  viewer._variantSurfaceId = viewer.addSurface(
    "VDW",
    { opacity: 1, color },
    { resi: [...variantResidues] },
    undefined,
    undefined,
    () => {} // include surface callback so addSurface returns surface id synchronously
  );
}

export function setVariantSurfaceColor({ viewer, color }) {
  if (viewer._variantSurfaceId == null) return;
  viewer.setSurfaceMaterialStyle(viewer._variantSurfaceId, { color });
}

export function drawBallAndStick({ viewer, atom, colorBy, pathogenicityScores }) {
  const color =
    colorBy === "confidence"
      ? getAlphaFoldConfidence(atom, "color")
      : getAlphaFoldPathogenicityColor(atom, pathogenicityScores);
  viewer.addStyle(
    { resi: atom.resi }, // draw ball and stick for all atoms in same residue
    {
      stick: { color },
      sphere: { radius: 0.4, color },
    }
  );
}

export function hoverManagerFactory({
  viewer,
  variantResidues,
  setHoveredAtom,
  colorBy,
  pathogenicityScores,
}) {
  let currentResi = null;

  function handleHover(atom) {
    if (!atom || currentResi === atom.resi) return;
    variantResidues.has(atom.resi)
      ? drawCartoon({ viewer, pathogenicityScores, variantResidues }) // make cartoon gray
      : drawBallAndStick({ viewer, atom, colorBy, pathogenicityScores });
    currentResi = atom.resi;
    setHoveredAtom(atom);
    viewer.render();
  }

  function handleUnhover(atom) {
    if (currentResi !== null) {
      viewer.setStyle({}, {});
      drawCartoon({ viewer, colorBy, pathogenicityScores, variantResidues });
      if (colorBy === "confidence" && variantResidues.has(currentResi)) {
        setVariantSurfaceColor({ viewer, color: "#0f0" });
      }
      currentResi = null;
      viewer.render();
      setHoveredAtom(null);
    }
  }

  return [{}, true, handleHover, handleUnhover];
}

export function setHoverBehavior({
  viewer,
  variantResidues,
  setHoveredAtom,
  colorBy,
  pathogenicityScores,
}) {
  const hoverDuration = 50;
  viewer.setHoverDuration(hoverDuration);
  const hoverArgs = hoverManagerFactory({
    viewer,
    variantResidues,
    setHoveredAtom,
    colorBy,
    pathogenicityScores,
  });
  const handleUnhover = hoverArgs[3];
  viewer.getCanvas().onmouseleave = () => {
    setTimeout(handleUnhover, hoverDuration + 50);
  };
  viewer.setHoverable(...hoverArgs);
}
