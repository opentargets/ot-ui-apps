import {
  max,
  scaleLinear,
  schemeDark2,
  schemeSet1,
  interpolateRdBu,
} from "d3";
import { Vector2 } from "3dmol";
import {
  getAlphaFoldConfidence,
  getAlphaFoldPathogenicityColor,
  aminoAcidLookup,
  aminoAcidHydrophobicity,
} from "@ot/constants";

const secondaryStructureColors = {
  h: "#008B8B",
  s: "#e6ab02", 
  c: "#c0c0c0",
}

export const domainColors = [
  ...[1, 2, 5, 0, 6].map(i => schemeDark2[i]),
  ...[1, 0, 4, 7, 2].map(i => schemeSet1[i]),
];

export const hydrophobicityColorInterpolator = v => interpolateRdBu(1 - v);

const hydrophobicityColorScale = scaleLinear()
  .domain([-55, 100])
  .range([0, 1]);

export function getHydrophobicityColor(resn) {
  return hydrophobicityColorInterpolator(
    hydrophobicityColorScale(aminoAcidHydrophobicity[resn].value)
  );
}

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

// hover on non-variant residue
function showHoverSpheres(state, resi) {
  if (resiOnVariant(state, resi)) return;

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

  if (resi !== state.viewer._clickedResi) {
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

function removeHoverSpheres(state) {
  state.viewer.removeAllShapes();
}

function resiOnVariant(state, resi) {
  return state.variantResidues.has(resi);
}

function getResiColor(state, resi) {
  switch (state.colorBy) {
    case "confidence":
      return getAlphaFoldConfidence(state.atomsByResi.get(resi)[0], "color");
    case "pathogenicity":
      return state.pathogenicityScores 
        ? getAlphaFoldPathogenicityColor(state.pathogenicityScores.get(resi))
        : "#ddd";
    case "domain": {
      if (!state.domains) return "#ddd";
      const domainIndex = state.domains.descriptionToIndex[state.domains.getDescription(resi)];
      return domainIndex == null
        ? "#ddd"
        : domainColors[domainIndex % domainColors.length];
    }
    case "hydrophobicity":
      return getHydrophobicityColor(state.atomsByResi.get(resi)[0].resn);
    case "secondary structure":
      return secondaryStructureColors[state.atomsByResi.get(resi)[0].ss];
    case "none":
      return "#ddd";
  }
}

function getHighightVariantResiColor(state, resi) {
  switch (state.colorBy) {
    case "pathogenicity":
      return state.variantPathogenicityScore
        ? getAlphaFoldPathogenicityColor(state.variantPathogenicityScore)
        : "lime";
    case "hydrophobicity":
      return getHydrophobicityColor(state.atomsByResi.get(resi)[0].resn);
    case "none":
      return "lime";
    default:
      return getResiColor(state, resi);
  }
}

function highlightVariantSurface(state) {
  state.viewer.setSurfaceMaterialStyle(
    state.viewer._variantSurfaceId,
    { colorfunc: atom => getHighightVariantResiColor(state, atom.resi) },
  );
}

function unhighlightVariantSurface(state) {
    state.viewer.setSurfaceMaterialStyle(
    state.viewer._variantSurfaceId,
    { color: "lime" },    
  );
}

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
      ? atom => (resiOnVariant(state, atom.resi)
        ? variantColor
        : atom.resi === state.viewer._clickedResi 
          ? clickColor
          : atom.resi === highlightResi
            ? getResiColor(state, atom.resi)
            : "#fff"
      )
      : atom => (resiOnVariant(state, atom.resi)
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

export function firstDrawHandler(state) {
  state.viewer.zoomTo({ resi: [...state.variantResidues] }, 0);
  state.viewer.zoom(0.2);
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

const baseCartoonStyle = state => ({
  cartoon: {
    hidden: state.representBy === "opaque" || state.representBy === "transparent",
    colorfunc: atom => getResiColor(state, atom.resi),
    arrows: true,
  },
});

export const drawAppearance = [
  { style: baseCartoonStyle },
  {
    selection: state => {
      if (state.representBy !== "cartoon") return {};
      const resis = [...state.variantResidues];
      if (state.viewer._clickedResi) resis.push(state.viewer._clickedResi);
      return { resi: resis };
    }, 
    style: { clicksphere: { radius: 1.5 } },  
    addStyle: true,
  },
];

export const hoverAppearance = [
  { // show spheres 
    selection: {},
    onApply: showHoverSpheres,
    leave: [{ onApply: removeHoverSpheres }],
    addStyle: true,
  },
  { // if hovering on variant residue:
    // - gray the cartoon or global surface
    // - color variant surface (and variant on global sirface) based on color option
    use: resiOnVariant,
    selection: {},
    addStyle: true,
    style: state => ({
      cartoon: {
        colorfunc: () => "#fff",
        hidden: state.representBy === "opaque" || state.representBy === "transparent",
      }
    }),
    onApply: (state, resi, interactionState) => {
      if (state.representBy !== "cartoon") {
        state.viewer.setSurfaceMaterialStyle(
          state.viewer._globalSurfaceId,
          {
            colorfunc: atom => resiOnVariant(state, atom.resi)
              ? getHighightVariantResiColor(state, atom.resi)
              : "#fff",
            opacity: state.representBy === "opaque" ? 1 : state.representBy === "transparent" ? 0.65 : 0.55
          },
        );
      }
      highlightVariantSurface(state);
    },
    leave: [
      { // update cartoon and/or global surface
        use: resiOnVariant,
        selection: {},
        addStyle: true,
        style: baseCartoonStyle,
        onApply: (state, resi, interactionState) => {
          if (!resiOnVariant(state, interactionState.hoveredResi)) {
            if (state.representBy === "opaque" || state.representBy === "transparent") {
              updateGlobalSurface(state);
            }
            unhighlightVariantSurface(state);
          }
        },
      },
    ],
  },
];

export const clickAppearance = [
  {
    use: (state, resi) => !resiOnVariant(state, resi),
    style: (state, resi) => state.representBy === "cartoon"
      ? { clicksphere: { radius: 1.5 } }
      : {},
    addStyle: true,
    onApply: (state, resi) => {
      if (resiOnVariant(state, resi)) return;
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
      { 
        use: (state, resi) => !resiOnVariant(state, resi),
        style: baseCartoonStyle,
        addStyle: true,
        onApply: (state, resi) => {
          state.viewer.removeSurface(state.viewer._clickedSurfaceId);
          state.viewer._clickedSurfaceId = null;
          state.viewer.removeLabel(state.viewer._clickedLabelId);
          state.viewer._clickedLabelId = null;
          state.viewer._clickedResi = null;
          if (state.representBy !== "cartoon") updateGlobalSurface(state);
        },
      },
      {
        use: (state, resi) => !resiOnVariant(state, resi),
        addStyle: true,
        style: (state, resi) => state.representBy === "cartoon"
          ? { clicksphere: { radius: 0 } }
          : {},
      }
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