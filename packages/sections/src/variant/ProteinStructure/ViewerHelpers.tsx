import { getAlphaFoldConfidence } from "@ot/constants";
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

function addVariantStyle(viewer, variantResidues, omitResi) {
  let resis = [...variantResidues];
  if (variantResidues.has(omitResi)) {
    resis = resis.filter(atom => atom !== omitResi);
  }
  viewer.addStyle(
    { resi: resis },
    {
      stick: { radius: 0.2, colorfunc: a => getAlphaFoldConfidence(a, "color") },
      sphere: { radius: 0.4, colorfunc: a => getAlphaFoldConfidence(a, "color") },
    }
  );
}

export function noHoverStyle(viewer, variantResidues) {
  viewer.setStyle(
    {},
    {
      cartoon: {
        colorfunc: a => getAlphaFoldConfidence(a, "color"),
        arrows: true,
      },
    }
  );
  addVariantStyle(viewer, variantResidues);
}

// function hoverManagerFactory({ viewer, atomInfoRef }) {
export function hoverManagerFactory({ viewer, variantResidues, setHoveredAtom }) {
  let currentResi = null;

  function handleHover(atom) {
    if (!atom || currentResi === atom.resi) return;
    setHoveredAtom(atom);
    const hslColor = hsl(getAlphaFoldConfidence(atom, "color"));
    hslColor.l += hslColor.l > 0.6 ? 0.1 : 0.2;
    const afColorLight = hslColor.toString();
    viewer.setStyle(
      // only need setStyle since doing cartoon - owise can use addStyle
      {},
      {
        cartoon: {
          colorfunc: a =>
            a.resi === currentResi ? afColorLight : getAlphaFoldConfidence(a, "color"),
          arrows: true,
        },
      }
    );
    addVariantStyle(viewer, variantResidues, atom.resi);
    viewer.addStyle(
      { resi: atom.resi },
      {
        stick: { color: afColorLight },
        sphere: { radius: 0.4, color: afColorLight },
      }
    );
    currentResi = atom.resi;
    viewer.render();
  }

  function handleUnhover(atom) {
    if (currentResi !== null) {
      noHoverStyle(viewer, variantResidues);
      currentResi = null;
      viewer.render();
      setHoveredAtom(null);
    }
  }

  return [{}, true, handleHover, handleUnhover];
}
