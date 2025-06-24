import { getAlphaFoldConfidence } from "@ot/constants";

// function resetViewer(viewer, duration = 0) {
//   viewer.zoomTo({}, duration);
//   viewer.zoom(10);
// }

export function onClickCapture(viewerRef, ensemblId) {
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
    link.download = `${ensemblId}-molecular-structure.png`;
    link.click();
  } catch (error) {
    console.error("Error taking screenshot:", error);
  } finally {
    // setLoading(false);
  }
}

export function setNoHoverStyle(viewer) {
  viewer.setStyle(
    {},
    {
      cartoon: {
        colorfunc: a => getAlphaFoldConfidence(a, "color"),
        arrows: true,
        // opacity: 0.7,
      },
    }
  );
  // addVariantStyle(viewer);
}

export function highlightVariants({ viewer, filteredRows, setStartPosition, setHoverInfo }) {
  for (const [resi, shape] of viewer.__highlightedResis__) {
    viewer.removeShape(shape);
    viewer.__highlightedResis__.delete(resi);
  }
  // !! CAN PROBABLY AVOID DOING THIS EVERY TIME
  const variantsByStartingPosition = Map.groupBy(filteredRows, row => row.aminoAcidPosition);
  for (const [startPosition, rows] of variantsByStartingPosition) {
    const carbonAtoms = viewer.__atomsByResi__
      .get(startPosition)
      ?.filter(atom => atom.elem === "C");
    if (!carbonAtoms) {
      // due to startingPosition greater than structure length
      // !! REMOVE CHECK ONCE DATA FIXED OR ONCE ALWAYS HAVE STRUCTURE LENGTH WHEN FILTERING ROWS
      continue;
    }
    // const sphereAtom = middleElement(carbonAtoms);
    const sphereAtom = carbonAtoms[0];
    let hoverSphere;
    viewer.__highlightedResis__.set(
      startPosition,
      viewer.addSphere({
        center: { x: sphereAtom.x, y: sphereAtom.y, z: sphereAtom.z },
        radius: 1.5,
        color: "#f00",
        opacity: 0.85,
        clickable: true,
        hoverable: true,
        hover_callback: sphere => {
          hoverSphere = viewer.addSphere({
            center: { x: sphereAtom.x, y: sphereAtom.y, z: sphereAtom.z },
            radius: 1.55,
            color: "#f00",
            opacity: 1,
            clickable: true,
            callback: () => {
              setStartPosition({ min: startPosition, max: startPosition });
            },
          });
          viewer.render();
          setHoverInfo({ startPosition, rows });
        },
        unhover_callback: () => {
          viewer.removeShape(hoverSphere);
          viewer.render();
          setHoverInfo(null);
        },
      })
    );
  }
  viewer.render();
}

export function highlightVariantFromTable({ viewer, row }) {
  if (!viewer) return;
  if (viewer.__extraHighlightedResi__) {
    viewer.removeShape(viewer.__extraHighlightedResi__);
    viewer.__extraHighlightedResi__ = null;
  }
  if (row) {
    const startPosition = row.aminoAcidPosition;
    const carbonAtoms = viewer.__atomsByResi__.get(startPosition).filter(atom => atom.elem === "C");
    // const sphereAtom = middleElement(carbonAtoms);
    const sphereAtom = carbonAtoms[0];
    viewer.__extraHighlightedResi__ = viewer.addSphere({
      center: { x: sphereAtom.x, y: sphereAtom.y, z: sphereAtom.z },
      radius: 1.6,
      color: "#0f0",
      opacity: 1,
    });
  }
  viewer.render();
}
