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

const alphaFoldStructureStem = "https://alphafold.ebi.ac.uk/files/";
const alphaFoldStructureSuffix = "-model_v4.cif";

function Body({ id: variantId, entity }) {
  const [structureLoading, setStructureLoading] = useState(true);
  const viewerRef = useRef(null);
  const messageRef = useRef(null);

  const variables = { variantId };
  // const variables = { ensemblId };
  const request = useQuery(PROTEIN_STRUCTURE_QUERY, {
    variables,
  });

  // !! HARD CODE KRAS FOR NOW !!
  const ensemblId = "ENSG00000133703";
  const uniprotId = "P01116";

  // !! HARD CODE RESDIDUE(S) OF VARIANT FOR NOW !!
  const variantResidues = new Set([21]);

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

  // fetch AlphaFold structure and view it
  useEffect(() => {
    async function fetchStructure() {
      showLoadingMessage();
      const pdbUri = `${alphaFoldStructureStem}AF-${uniprotId}-F1${alphaFoldStructureSuffix}`;
      let data /*, parsedCif */, viewer;

      // fetch structure data
      let response;
      try {
        response = await fetch(pdbUri);
        if (!response.ok) {
          console.error(`Response status (CIF request): ${response.status}`);
          showLoadingMessage("Failed to download structure data");
        }
      } catch (error) {
        console.error(error.message);
        showLoadingMessage("Failed to download structure data");
      }

      // parse data
      if (response?.ok) {
        try {
          data = await response.text();
          // parsedCif = parseCif(data)[selectedStructure.id];
        } catch (error) {
          console.error(error.message);
          showLoadingMessage("Failed to parse structure data");
        }
      }

      // view data
      if (data /* && parsedCif */ && viewerRef.current) {
        viewer = createViewer(viewerRef.current, {
          backgroundColor: "#f8f8f8",
          antialias: true,
          cartoonQuality: 10,
        });
        window.viewer = viewer; // !! REMOVE !!

        viewer.getCanvas().ondblclick = () => resetViewer(viewer, 200); // use ondblclick so replaces existing
        viewer.addModel(data, "cif"); /* load data */
        viewer.setStyle(
          {},
          {
            cartoon: {
              // color: "#ddd",
              // color: "spectrum",
              colorfunc: atom => getAlphaFoldConfidence(atom, "color"),
              arrows: true,
              // opacity: 0.9,
            },
          }
        );
        viewer.addSurface("VDW", { opacity: 0.65, color: "#fff" }, {});
        // viewer.addSurface("VDW", { opacity: 1, color: "red" }, { resi: [...variantResidues] });

        // viewer.setStyle(
        //   { resi: [...variantResidues] },
        //   {
        //     stick: { radius: 0.2 },
        //     sphere: { radius: 0.4 },
        //     cartoon: {
        //       color: "#ddd",
        //       arrows: true,
        //     },
        //   }
        // );
        const residueAtoms = viewer.getModel().selectedAtoms({ resi: [...variantResidues] });
        // window.residueAtoms = residueAtoms;
        const carbonAtoms = residueAtoms.filter(atom => atom.elem === "C");
        console.log(carbonAtoms);
        const sphereAtom = carbonAtoms[2];
        viewer.addSphere({
          center: { x: sphereAtom.x, y: sphereAtom.y, z: sphereAtom.z },
          radius: 2,
          color: "red",
          opacity: 1,
        });
        resetViewer(viewer);
        viewer.zoom(0.2);
        viewer.render();
        hideLoadingMessage();
      }
    }
    if (uniprotId) fetchStructure();
    return () => viewer?.clear();
  }, []);

  // if (!experimentalResults) return null;

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => (
        <Description
          variantId={request.data?.variant.id}
          referenceAllele={request.data?.variant.referenceAllele}
          alternateAllele={request.data?.variant.alternateAllele}
        />
      )}
      renderBody={() => (
        <Box>
          <Box position="relative" display="flex" justifyContent="center" pb={2}>
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
              {/* <Box
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
                  <Typography variant="caption" component="p" textAlign="right" />
                </Box>
              </Box> */}
            </Box>
          </Box>
          <AlphaFoldLegend />
        </Box>
      )}
    />
  );
}

{
  /* {isAlphaFold(selectedStructure) && <AlphaFoldLegend />} */
}

export default Body;
