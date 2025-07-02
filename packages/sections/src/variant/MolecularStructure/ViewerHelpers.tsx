import { getAlphaFoldConfidence, getAlphaFoldPathogenicityColor } from "@ot/constants";

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
