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

// const alphaFoldResultsStem = "https://alphafold.ebi.ac.uk/api/prediction/";
const alphaFoldStructureStem = "https://alphafold.ebi.ac.uk/files/";
const alphaFoldStructureSuffix = "-model_v4.cif";

// function zipToObject(arr1, arr2) {
//   const obj = {};
//   if (!Array.isArray(arr1)) arr1 = [arr1];
//   if (!Array.isArray(arr2)) arr2 = [arr2];
//   arr1.forEach((value, index) => (obj[value] = arr2[index]));
//   return obj;
// }

// keep as closure since may need local state in future - such as hovered on atom
// for highlighting
// function hoverManagerFactory({
//   viewer,
//   atomInfoRef,
//   parsedCif,
//   showModel,
//   chainToEntityDesc,
//   isAF,
// }) {
//   return [
//     {},
//     true,
//     atom => {
//       const infoElmt = atomInfoRef.current;
//       if (infoElmt) {
//         infoElmt.style.display = "block";
//         const fieldElmts = [...infoElmt.querySelectorAll("p")];
//         const pdbModel = parsedCif["_atom_site.pdbx_PDB_model_num"][atom.index];
//         const authChain = parsedCif["_atom_site.auth_asym_id"][atom.index];
//         const pdbChain = parsedCif["_atom_site.label_asym_id"][atom.index];
//         const authAtom = parsedCif["_atom_site.auth_seq_id"][atom.index];
//         const pdbAtom = parsedCif["_atom_site.label_seq_id"][atom.index];
//         fieldElmts[0].textContent = chainToEntityDesc[pdbChain];
//         fieldElmts[1].textContent = `${showModel ? `Model: ${pdbModel} | ` : ""}${pdbChain}${
//           authChain && authChain !== pdbChain ? ` (auth: ${authChain})` : ""
//         } | ${atom.resn} ${pdbAtom}${
//           authAtom && authAtom !== pdbAtom ? ` (auth: ${authAtom})` : ""
//         }`;
//         fieldElmts[2].textContent = isAF ? `Confidence: ${atom.b} (${getConfidence(atom)})` : "";
//       }
//     },
//     () => {
//       if (atomInfoRef.current) {
//         atomInfoRef.current.style.display = "none";
//       }
//     },
//   ];
// }

function Body({ id: variantId, entity }) {
  // const [viewer, setViewer] = useState(null);
  const [structureLoading, setStructureLoading] = useState(true);
  // const [structure, setStructure] = useState(null);
  const viewerRef = useRef(null);
  // const atomInfoRef = useRef(null);
  const messageRef = useRef(null);

  const variables = { variantId };
  // const variables = { ensemblId };
  const request = useQuery(PROTEIN_STRUCTURE_QUERY, {
    variables,
  });

  // !! HARD CODE KRAS FOR NOW !!
  const ensemblId = "ENSG00000133703";
  const uniprotId = "P01116";

  // const uniprotId = request?.data?.target
  //   ? getUniprotIds(request?.data?.target?.proteinIds)?.[0]
  //   : null;

  //   function getSelectedRows(selectedRows) {
  //     selectedRows.length > 0 && setSelectedStructure(selectedRows[0]?.original);
  //   }

  // function hideAtomInfo() {
  //   if (atomInfoRef.current) atomInfoRef.current.style.display = "none";
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

  // function clearStructureInfo() {
  //   structureInfoRef.current?.querySelectorAll("span")?.forEach(span => (span.textContent = ""));
  // }

  // fetch AlphaFold structure and view it
  useEffect(() => {
    async function fetchStructure() {
      showLoadingMessage();
      const pdbUri = `${alphaFoldStructureStem}${uniprotId}${alphaFoldStructureSuffix}`;
      let data /*, parsedCif */, viewer;

      // fetch structure data
      try {
        const response = await fetch(pdbUri);
        console.log(response);
        if (!response.ok) {
          console.error(`Response status (CIF request): ${response.status}`);
          showLoadingMessage("Failed to download structure data");
        }
      } catch (error) {
        console.error(error.message);
        showLoadingMessage("Failed to download structure data");
      }

      // parse data
      try {
        data = await response.text();
        // parsedCif = parseCif(data)[selectedStructure.id];
      } catch (error) {
        console.error(error.message);
        showLoadingMessage("Failed to parse structure data");
      }

      // view data
      if (data /* && parsedCif */ && viewerRef.current) {
        viewer = createViewer(viewerRef.current, {
          backgroundColor: "#f8f8f8",
          antialias: true,
          cartoonQuality: 10,
        });
        // function resetViewer(duration = 0) {
        //   viewer.zoomTo(
        //     {
        //       chain: firstStructureTargetChains.length
        //         ? firstStructureTargetChains
        //         : firstStructureChains,
        //     },
        //     duration
        //   );
        //   viewer.zoom(isAlphaFold(selectedStructure) ? 1.4 : 1, duration);
        // }

        // const hoverDuration = 50;
        // viewer.getCanvas().onmouseleave = () => {
        //   setTimeout(hideAtomInfo, hoverDuration + 50);
        // };
        // viewer.getCanvas().ondblclick = () => resetViewer(200); // use ondblclick so replaces existing
        viewer.addModel(data, "cif"); /* load data */
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
      renderDescription={() => <Description variantId={variantId} />}
      renderBody={() => (
        <Box>
          {/* <Box
            ref={structureInfoRef}
            display="flex"
            alignItems="baseline"
            minHeight={22}
            gap={0.5}
            ml={2}
            mt={0.75}
            mb={1}
          >
            <Typography variant="subtitle2" component="span"></Typography>
            <Typography variant="body2" component="span"></Typography>
          </Box> */}
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
