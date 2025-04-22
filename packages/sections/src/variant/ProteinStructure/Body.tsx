import { useQuery } from "@apollo/client";
import { SectionItem, OtTable, Link } from "ui";
// import { naLabel } from "@ot/constants";
import { Box, Button, Grid, Typography } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import { getUniprotIds, nanComparator } from "@ot/utils";
import { createViewer } from "3dmol";
import { parseCif } from "./parseCif";
import { schemeSet1, schemeDark2 } from "d3";

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
  const variantResidues = new Set([21, 22, 23]);

  // function colorAtom(atom) {
  //   return variantResidues.has(atom.resi) ? "#f00" : "#888";
  // }

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
    // let cx = 0,
    //   cy = 0,
    //   cz = 0;
    // const residueAtoms = viewer.getModel().selectedAtoms({ resi: [...variantResidues] });
    // for (let atom of residueAtoms) {
    //   cx += atom.x;
    //   cy += atom.y;
    //   cz += atom.z;
    // }
    // cx /= residueAtoms.length;
    // cy /= residueAtoms.length;
    // cz /= residueAtoms.length;

    // const variantResiduesCentroid = { x: cx, y: cy, z: cz };
    // const zUnit = { x: 0, y: 0, z: 1 };
    // const rotation = computeRotationToAlignVectors(variantResiduesCentroid, zUnit);

    // console.log(viewer.getView());
    // console.log({ variantResiduesCentroid, zUnit, rotation });

    // const view = viewer.jmolMoveTo(200, rotation);
    // SHOULD translate after roatated - assuming rotation
    // viewer.setView(view);

    // viewer.jmolMoveTo(1000, rotation);

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
    // viewer.translate(-cx, -cy, -cz); // Re-center
    // !! FIXED ZOOM BELOW PROBABLY NOT APPROPRIATE !!
    // viewer.zoom(0.3, duration);
  }

  function computeRotationToAlignVectors(v1, v2) {
    function normalize(v) {
      const len = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
      return len === 0 ? { x: 0, y: 0, z: 0 } : { x: v.x / len, y: v.y / len, z: v.z / len };
    }

    function cross(a, b) {
      return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x,
      };
    }

    function dot(a, b) {
      return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    const v1n = normalize(v1);
    const v2n = normalize(v2);
    const axis = normalize(cross(v1n, v2n));
    const cosTheta = dot(v1n, v2n);
    const angleRad = Math.acos(Math.min(Math.max(cosTheta, -1), 1)); // clamp to avoid NaN
    const angleDeg = angleRad * (180 / Math.PI);

    // Handle edge case: vectors are already aligned or opposite
    if (angleDeg === 0 || isNaN(angleDeg)) {
      return { x: 0, y: 0, z: 1, angle: 0 };
    }

    return {
      x: axis.x,
      y: axis.y,
      z: axis.z,
      angle: angleDeg,
    };
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

        // const hoverDuration = 50;
        // viewer.getCanvas().onmouseleave = () => {
        //   setTimeout(hideAtomInfo, hoverDuration + 50);
        // };
        // viewer.getCanvas().ondblclick = () => resetViewer(200); // use ondblclick so replaces existing
        viewer.getCanvas().ondblclick = () => resetViewer(viewer, 200); // use ondblclick so replaces existing
        viewer.addModel(data, "cif"); /* load data */
        viewer.setStyle(
          {},
          {
            cartoon: {
              color: "#ddd",
              arrows: true,
              opacity: 0.9,
            },
          }
        );
        viewer.setStyle(
          { resi: [...variantResidues] },
          {
            cartoon: {
              color: "red",
              arrows: true,
            },
          }
        );
        // viewer.setHoverDuration(hoverDuration);
        // viewer.setHoverable(
        //   ...hoverManagerFactory({
        //     viewer,
        //     atomInfoRef,
        //     parsedCif,
        //     showModel: new Set(parsedCif["_atom_site.pdbx_PDB_model_num"]).size > 1,
        //     chainToEntityDesc,
        //     isAF,
        //   })
        // );

        // if (isAF) {
        //   viewer.setStyle(
        //     {},
        //     {
        //       cartoon: {
        //         colorfunc: atom => getConfidence(atom, "color"),
        //         arrows: true,
        //       },
        //     }
        //   );
        // } else {
        //   viewer.setStyle(
        //     { chain: firstStructureTargetChains },
        //     { cartoon: { colorfunc: atom => scheme[atom.chain], arrows: true } }
        //   );
        //   viewer.setStyle(
        //     { chain: firstStructureNonTargetChains },
        //     {
        //       cartoon: {
        //         color: "#eee",
        //         arrows: true,
        //         opacity: 0.8,
        //       },
        //     }
        //   );
        // viewer.getModel().setStyle({ chain: otherStructureChains }, { hidden: true });
        // }
        // resetViewer();
        resetViewer(viewer);
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
        </Box>
      )}
    />
  );
}

{
  /* {isAlphaFold(selectedStructure) && <AlphaFoldLegend />} */
}

export default Body;
