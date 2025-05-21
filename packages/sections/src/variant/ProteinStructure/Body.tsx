import { useQuery } from "@apollo/client";
import { SectionItem, CompactAlphaFoldLegend } from "ui";
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
  const [messageText, setMessageText] = useState("Loading structure ...");
  const [hoveredAtom, setHoveredAtom] = useState(null);
  const viewerRef = useRef(null);

  const variables = { variantId };
  const request = useQuery(PROTEIN_STRUCTURE_QUERY, {
    variables,
  });
  let proteinCodingCoordinates, variantResidues;
  const gqlData = request?.data?.variant;
  if (gqlData) {
    proteinCodingCoordinates = gqlData.proteinCodingCoordinates?.rows?.[0];
    if (proteinCodingCoordinates) {
      variantResidues = new Set(
        gqlData.referenceAllele.split("").map((v, i) => {
          return i + proteinCodingCoordinates.aminoAcidPosition;
        })
      );
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

  function noHoverStyle(viewer) {
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

  // function hoverManagerFactory({ viewer, atomInfoRef }) {
  function hoverManagerFactory({ viewer }) {
    let currentResi = null;

    function handleHover(atom) {
      if (!atom || currentResi === atom.resi) return;
      // const atomInVariant = variantResidues.has(atom.resi);
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
    }

    function handleUnhover(atom) {
      if (currentResi !== null) {
        noHoverStyle(viewer);
        // if (currentSurface) viewer.removeSurface(currentSurface);
        currentResi = null;
        // if (atomInfoRef.current) atomInfoRef.current.style.display = "none";
        viewer.render();
        setHoveredAtom(null);
      }
    }

    return [{}, true, handleHover, handleUnhover];
  }

  // fetch AlphaFold structure and view it
  useEffect(() => {
    let viewer;
    if (proteinCodingCoordinates) {
      async function fetchStructure() {
        let structureData, response;

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

        // parse structure data
        if (response) {
          try {
            structureData = await response.text();
          } catch (error) {
            console.error(error.message);
            setMessageText("Failed to parse structure data");
          }
        } else {
          setMessageText("AlphaFold structure not available");
        }

        // view data
        if (structureData && viewerRef.current) {
          viewer = createViewer(viewerRef.current.querySelector(".viewerContainer"), {
            backgroundColor: "#f8f8f8",
            antialias: true,
            cartoonQuality: 10,
          });
          window.viewer = viewer; // !! REMOVE !!
          const hoverDuration = 10;
          viewer.getCanvas().ondblclick = () => resetViewer(viewer, 200); // use ondblclick so replaces existing
          viewer.addModel(structureData, "cif");
          viewer.setHoverDuration(hoverDuration);
          const hoverArgs = hoverManagerFactory({ viewer });
          // const hoverArgs = hoverManagerFactory({ viewer, atomInfoRef });
          const handleUnhover = hoverArgs[3];
          viewer.getCanvas().onmouseleave = () => {
            setTimeout(handleUnhover, hoverDuration + 50);
          };
          viewer.setHoverable(...hoverArgs);
          noHoverStyle(viewer);
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
          viewer.addSurface(
            "VDW",
            { opacity: 0.75, color: "#0f0" },
            { resi: [...variantResidues] }
          );
          resetViewer(viewer);
          viewer.zoom(0.2);
          viewer.render();
          // hideLoadingMessage();
          setMessageText("");
        }
      }
      fetchStructure();
      return () => {
        // hideAtomInfo();
        setHoveredAtom("");
        viewer?.clear();
      };
    }
  }, [proteinCodingCoordinates]);

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
          targetId={proteinCodingCoordinates?.target?.approvedSymbol}
          targetApprovedSymbol={proteinCodingCoordinates?.target?.approvedSymbol}
        />
      )}
      renderBody={() => (
        <Box ref={viewerRef} position="relative" width="100%">
          {/* info text */}
          <Typography variant="body2" sx={{ pb: 1 }}>
            AlphaFold prediction with reference allele of variant highlighted. What else from API do
            we want here or in subheader above?
          </Typography>

          {/* container to insert viewer into */}
          <Box className="viewerContainer" position="relative" width="100%" height={380} mb={1}>
            {/* screenshot button */}
            {!messageText && (
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
                  onClick={() => onClickCapture(viewerRef, state.data.id)}
                >
                  <FontAwesomeIcon icon={faCamera} /> Screenshot
                </Button>
              </Box>
            )}

            {/* atom info */}
            {hoveredAtom && (
              <Box
                // ref={atomInfoRef}
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
                  <Typography variant="caption" component="p" textAlign="right">
                    {hoveredAtom.resn} {hoveredAtom.resi}
                  </Typography>
                  <Typography variant="caption" component="p" textAlign="right">
                    Confidence: {hoveredAtom.b} ({getAlphaFoldConfidence(hoveredAtom)})
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          <CompactAlphaFoldLegend />

          {/* message text */}
          {messageText && (
            <Typography
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
                backgroundColor: "#f8f8f8",
              }}
            >
              {messageText}
            </Typography>
          )}
        </Box>
      )}
    />
  );
}

export default Body;
