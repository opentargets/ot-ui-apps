import {
  alphaFoldPathogenicityColorScale,
  getAlphaFoldConfidence,
  getAlphaFoldPathogenicityColor,
} from "@ot/constants";
import { hsl } from "d3";

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

export function onClickCapture(viewerRef, targetId) {
  if (!viewerRef.current) return;

  try {
    // Get the canvas element from the container
    const canvas = viewerRef.current.querySelector("canvas");

    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    // Create a new canvas with proper background
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;

    const ctx = newCanvas.getContext("2d");

    // Draw background
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Draw original canvas content on top
    ctx.drawImage(canvas, 0, 0);

    // Convert the new canvas to data URL
    const dataUrl = newCanvas.toDataURL("image/png");

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${targetId}-molecular-structure.png`;
    link.click();
  } catch (error) {
    console.error("Error taking screenshot:", error);
  } finally {
    // setLoading(false);
  }
}

// function drawVariantBallAndStick(viewer, variantResidues, omitResi) {
//   let resis = [...variantResidues];
//   if (variantResidues.has(omitResi)) {
//     resis = resis.filter(atom => atom !== omitResi);
//   }
//   viewer.addStyle(
//     { resi: resis },
//     {
//       stick: { radius: 0.2, colorfunc: a => getAlphaFoldConfidence(a, "color") },
//       sphere: { radius: 0.4, colorfunc: a => getAlphaFoldConfidence(a, "color") },
//     }
//   );
// }

export function drawCartoon({ viewer, colorBy, pathogenicityScores, highlightResi }) {
  const basicColorfunc =
    colorBy === "confidence"
      ? a => getAlphaFoldConfidence(a, "color")
      : a => getAlphaFoldPathogenicityColor(a, pathogenicityScores);
  const colorfunc = highlightResi
    ? a => {
        const color = basicColorfunc(a, "color");
        return a.resi === highlightResi ? getHighlightColor(color) : color;
      }
    : basicColorfunc;
  viewer.addStyle({}, { cartoon: { colorfunc, arrows: true } });
}

export function drawVariantSurface({
  viewer,
  variantResidues,
  colorBy,
  variantPathogenicityScore,
}) {
  const variantColor =
    colorBy === "confidence" || typeof variantPathogenicityScore !== "number"
      ? "#0d0"
      : alphaFoldPathogenicityColorScale(variantPathogenicityScore);
  if (viewer._variantSurfaceId) viewer.removeSurface(viewer._variantSurfaceId);
  viewer._variantSurfaceId = viewer.addSurface(
    "VDW",
    { opacity: 1, color: variantColor },
    { resi: [...variantResidues] },
    undefined,
    undefined,
    () => {} // include surface callback so addSurface returns surface id synchronously
  );
}

export function drawBallAndStick({ viewer, atom, colorBy, pathogenicityScores }) {
  console.log(colorBy);
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

function getHighlightColor(color: string) {
  const hslColor = hsl(color);
  hslColor.l += hslColor.l > 0.6 ? 0.1 : 0.2;
  return hslColor.toString();
}
