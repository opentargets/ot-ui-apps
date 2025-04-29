import { useQuery } from "@apollo/client";
import { SectionItem, AlphaFoldLegend } from "ui";
import { Box, Button, Typography } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import { getAlphaFoldConfidence } from "@ot/constants";
import { createViewer } from "3dmol";

import PROTEIN_STRUCTURE_QUERY from "./ProteinStructureQuery.gql";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { hsl } from "d3";

const alphaFoldStructureStem = "https://alphafold.ebi.ac.uk/files/";
const alphaFoldStructureSuffix = "-model_v4.cif";

function Body({ id: variantId, entity }) {
  const [structureLoading, setStructureLoading] = useState(true);
  const viewerRef = useRef(null);
  const messageRef = useRef(null);
  const atomInfoRef = useRef(null);

  const variables = { variantId };
  const request = useQuery(PROTEIN_STRUCTURE_QUERY, {
    variables,
  });
  let proteinCodingCoordinates, maxVariantEffect, variantResidues;
  const gqlData = request?.data?.variant;
  if (gqlData) {
    proteinCodingCoordinates = gqlData.proteinCodingCoordinates?.rows?.[0];
    maxVariantEffect = proteinCodingCoordinates?.maxVariantEffectForPosition;
    variantResidues = new Set(
      gqlData.referenceAllele.split("").map((v, i) => {
        return i + proteinCodingCoordinates.aminoAcidPosition;
      })
    );
  }

  function showLoadingMessage(message = "Loading structure ...") {
    if (messageRef.current) {
      setStructureLoading(true);
      messageRef.current.style.display = "flex";
      messageRef.current.textContent = message;
    }
  }

  function hideLoadingMessage() {
    if (messageRef.current) {
      messageRef.current.style.display = "none";
      setStructureLoading(false);
    }
  }

  function resetViewer(viewer, duration = 0) {
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

  function onClickCapture() {
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

  function addVariantStyle(viewer, omitResi) {
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

  function setNoHoverStyle(viewer) {
    viewer.setStyle(
      {},
      {
        cartoon: {
          colorfunc: a => getAlphaFoldConfidence(a, "color"),
          arrows: true,
        },
      }
    );
    addVariantStyle(viewer);
  }

  function hoverManagerFactory({ viewer, atomInfoRef }) {
    let currentResi = null;

    function handleHover(atom) {
      if (!atom || currentResi === atom.resi) return;
      // const atomInVariant = variantResidues.has(atom.resi);
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
      addVariantStyle(viewer, atom.resi);
      viewer.addStyle(
        { resi: atom.resi },
        {
          stick: { color: afColorLight },
          sphere: { radius: 0.4, color: afColorLight },
        }
      );
      currentResi = atom.resi;
      viewer.render();
      const infoElmt = atomInfoRef.current;
      if (infoElmt) {
        infoElmt.style.display = "block";
        const fieldElmts = [...infoElmt.querySelectorAll("p")];
        fieldElmts[0].textContent = `${atom.resn} ${atom.resi}`;
        fieldElmts[1].textContent = `Confidence: ${atom.b} (${getAlphaFoldConfidence(atom)})`;
      }
    }

    function handleUnhover(atom) {
      if (currentResi !== null) {
        setNoHoverStyle(viewer);
        // if (currentSurface) viewer.removeSurface(currentSurface);
        currentResi = null;
        if (atomInfoRef.current) atomInfoRef.current.style.display = "none";
        viewer.render();
      }
    }

    return [{}, true, handleHover, handleUnhover];
  }

  // fetch AlphaFold structure and view it
  useEffect(() => {
    let viewer;
    async function fetchStructure() {
      showLoadingMessage();
      let data, response;

      async function fetchStructureFile(uniprotId) {
        const pdbUri = `${alphaFoldStructureStem}AF-${uniprotId}-F1${alphaFoldStructureSuffix}`;
        let newResponse;
        try {
          newResponse = await fetch(pdbUri);
          if (newResponse?.ok) response = newResponse;
        } catch (error) {}
      }

      // fetch structure data
      const uniprotIds = [...(proteinCodingCoordinates?.uniprotAccessions ?? [])];
      while (!response && uniprotIds.length) {
        await fetchStructureFile(uniprotIds.shift());
      }

      // parse data
      if (response) {
        try {
          data = await response.text();
        } catch (error) {
          console.error(error.message);
          showLoadingMessage("Failed to parse structure data");
        }
      }

      // view data
      if (data && viewerRef.current) {
        viewer = createViewer(viewerRef.current, {
          backgroundColor: "#f8f8f8",
          antialias: true,
          cartoonQuality: 10,
        });
        window.viewer = viewer; // !! REMOVE !!
        const hoverDuration = 10;
        viewer.getCanvas().ondblclick = () => resetViewer(viewer, 200); // use ondblclick so replaces existing
        viewer.addModel(data, "cif"); /* load data */
        viewer.setHoverDuration(hoverDuration);
        const hoverArgs = hoverManagerFactory({ viewer, atomInfoRef });
        const hideAtomInfo = hoverArgs[3];
        viewer.getCanvas().onmouseleave = () => {
          setTimeout(hideAtomInfo, hoverDuration + 50);
        };
        viewer.setHoverable(...hoverArgs);
        setNoHoverStyle(viewer);
        // viewer.addSurface(
        //   "VDW",
        //   {
        //     opacity: 1,
        //     opacity: 0.65,
        //     color: "#fff",
        //     // color: {'prop': 'b', map:elementColors.greenCarbon}
        //   },
        //   {}
        // );
        viewer.addSurface("VDW", { opacity: 0.65, color: "#fff" }, { resi: [...variantResidues] });
        resetViewer(viewer);
        viewer.zoom(0.2);
        viewer.render();
        hideLoadingMessage();
      }
    }
    fetchStructure();
    return () => {
      // hideAtomInfo();
      viewer?.clear();
    };
    // !! DODGY TO LOCAL VARIABLE AS DE. HOW SHOLD KNOW WHEN REQUEST FULFILLED?
  }, [proteinCodingCoordinates]);

  // if (!response) return null;

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => (
        <Description
          variantId={gqlData?.id}
          referenceAllele={gqlData?.referenceAllele}
          alternateAllele={gqlData?.alternateAllele}
          targetId={proteinCodingCoordinates?.targetId}
        />
      )}
      renderBody={() => (
        <Box>
          <Box position="relative" pb={2}>
            <Typography variant="body2" sx={{ pb: 1 }}>
              AlphaFold prediction with reference allele of variant highlighted. Maximum variant
              effect for position: {maxVariantEffect?.value?.toFixed(2)} ({maxVariantEffect?.method}
              ).
            </Typography>
            <Box ref={viewerRef} position="relative" width="100%" height="400px">
              <Typography
                ref={messageRef}
                variant="body2"
                component="div"
                sx={{
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  position: "absolute",
                  zIndex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
              <Box
                sx={{
                  top: 0,
                  right: 0,
                  position: "absolute",
                  zIndex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "white",
                  m: 1,
                }}
              >
                <Button
                  sx={{ display: "flex", gap: 1 }}
                  disabled={structureLoading}
                  onClick={onClickCapture}
                >
                  <FontAwesomeIcon icon={faCamera} /> Screenshot
                </Button>
              </Box>
              <Box
                ref={atomInfoRef}
                position="absolute"
                bottom={0}
                right={0}
                p="0.6rem 0.8rem"
                zIndex={100}
                bgcolor="#f8f8f8c8"
                sx={{ borderTopLeftRadius: "0.2rem", pointerEvents: "none" }}
                fontSize={14}
              >
                <Box display="flex" flexDirection="column">
                  <Typography variant="caption" component="p" textAlign="right" />
                  <Typography variant="caption" component="p" textAlign="right" />
                </Box>
              </Box>
            </Box>
          </Box>
          <AlphaFoldLegend />
        </Box>
      )}
    />
  );
}

export default Body;
