export function isAlphaFold(selectedRow) {
  return selectedRow?.type?.toLowerCase?.() === "alphafold";
}

export function zipToObject(arr1, arr2) {
  const obj = {};
  if (!Array.isArray(arr1)) arr1 = [arr1];
  if (!Array.isArray(arr2)) arr2 = [arr2];
  arr1.forEach((value, index) => (obj[value] = arr2[index]));
  return obj;
}

export function modulo(n, d) {
  return ((n % d) + d) % d;
}

export function getSegments(chainsAndPositions) {
  const printChains = [];
  const printSegments = [];
  const details = {};
  const substrings = chainsAndPositions.split(/,\s*/);
  let maxLengthSegment = -Infinity;
  for (const substr of substrings) {
    const eqIndex = substr.indexOf("=");
    const chains = substr.slice(0, eqIndex);
    printChains.push(chains);
    const sepChains = chains.split("/");
    const interval = substr.slice(eqIndex + 1);
    printSegments.push(substrings.length === 1 ? interval : `${chains}=${interval}`);
    const [from, to] = interval.split("-");
    maxLengthSegment = Math.max(maxLengthSegment, to - from);
    for (const chain of sepChains) {
      details[chain] ??= [];
      details[chain].push({ from, to });
    }
  }
  return {
    chainsString: printChains.join(", "),
    segmentsString: printSegments.join(", "),
    details,
    uniqueChains: new Set(Object.keys(details)),
    maxLengthSegment,
  };
}

export function hoverManagerFactory({ parsedCif, chainToEntityDesc, setHoverInfo }) {
  let currentResi = null;

  function handleHover(atom) {
    if (!atom || currentResi === atom.resi) return;
    const pdbChain = parsedCif["_atom_site.label_asym_id"][atom.index];
    setHoverInfo({
      atom,
      chainName: chainToEntityDesc[pdbChain],
      authChain: parsedCif["_atom_site.auth_asym_id"][atom.index],
      pdbChain,
      authAtom: parsedCif["_atom_site.auth_seq_id"][atom.index],
      pdbAtom: parsedCif["_atom_site.label_seq_id"][atom.index],
    });
    currentResi = atom.resi;
  }

  function handleUnhover(atom) {
    if (currentResi !== null) {
      setHoverInfo(null);
    }
  }

  return [{}, true, handleHover, handleUnhover];
}

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
