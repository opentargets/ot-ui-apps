import { useQuery } from "@apollo/client";
import { SectionItem, AlphaFoldLegend } from "ui";
import { Box, Button, Typography } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import { getAlphaFoldConfidence } from "@ot/constants";
import { createViewer, SurfaceType } from "3dmol";

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
  // const variables = { ensemblId };
  const request = useQuery(PROTEIN_STRUCTURE_QUERY, {
    variables,
  });

  // !! HARD CODE PROTEIN AND MAKE UP OTHER VALUES FOR NOW !!
  const ensemblId = "ENSG00000133703"; // KRAS, ~200 residues
  const uniprotId = "P01116";
  // const ensemblId = "ENSG00000108557";  // ~2000 residues
  // const uniprotId = "Q7Z5J4";
  const maxVariantEffect = 0.7;

  // !! HARD CODE RESDIDUE(S) OF VARIANT FOR NOW !!
  const variantResidues = new Set([21, 22, 23]);

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

  // function styleFromForm({ molecule, variant }) {
  //   const moleculeStyle = {};
  //   const variantStyle = {};
  //   let moleculeSurface = null;
  //   let variantSurface = null;
  //   const stickStyle = { radius: 0.2, colorfunc: a => getAlphaFoldConfidence(a, "color") };
  //   const ballStyle = { radius: 0.4, colorfunc: a => getAlphaFoldConfidence(a, "color") };
  //   const surfaceArgs = ["VDW", { opacity: 0.65, color: "#fff" }]; // without atom selection
  //   if (molecule.cartoon || !(molecule.ballStick || molecule.surface)) {
  //     moleculeStyle.cartoon = {
  //       colorfunc: a => getAlphaFoldConfidence(a, "color"),
  //       arrows: true,
  //     };
  //   }
  //   if (molecule.ballStick) {
  //     moleculeStyle.stick = stickStyle;
  //     moleculeStyle.ball = ballStyle;
  //   } else if (variant.ballStick) {
  //     variantStyle.stick = stickStyle;
  //     variantStyle.ball = ballStyle;
  //   }
  //   if (molecule.surface) {
  //     moleculeSurface = surfaceArgs;
  //   } else if (variant.surface) {
  //     variantSurface = surfaceArgs;
  //   }
  //   return { moleculeStyle, variantStyle, moleculeSurface, variantSurface };
  // }

  function applyStyleFactory(viewer, variantResidues, isHover = false) {
    const _cartoonStyle = { 
      colorfunc: a => getAlphaFoldConfidence(a, "color"),
      arrows: true,
    };
    const _stickStyle = { radius: 0.2, colorfunc: a => getAlphaFoldConfidence(a, "color") };
    const _ballStyle = { radius: 0.4, colorfunc: a => getAlphaFoldConfidence(a, "color") };
    const _surfaceArgs = ["VDW", { opacity: 0.65, color: "#fff" }]; 
    
    // defaults
    const _moleculeSettings = {
      cartoon: true,
      "ball and stick": false,
      surface: false,
    };
    const _variantSettings = {
      "ball and stick": true,
      surface: true,
    };

    function toggleMoleculeSetting(prop, checked) {
      _moleculeSettings[prop] = checked;
    }
    function toggleVariantSetting(prop, checked) {
      _variantSettings[prop] = checked;
    }

    function _baseStyle() {  // used for setStyle
      const style = {};
      
      !!!! HERE !!!! 
      SIMILAR LOGIC TO COMMENTED ABOVE!!!!!!


      return [{}, style];
    }
    function _additionalStyles() {  // each entry passed to addStyle
      
    }

    function redraw() {
      viewer.removeAllSurfaces();
      viewer.setStyle({}, _baseStyle());
      for (const [selection, style] of _additionalStyles()) {
        viewer.addStyle(selection, style);
      }
      if (_moleculeSettings.surface) {
        viewer.addSurface(..._surfaceArgs);
      } else if (_variantSettings.surface, {}) {
        viewer.addSurface(..._surfaceArgs, { resi: variantResidues });
      }
      viewer.render();
    } 

    return { toggleMoleculeSetting, toggleVariantSetting, redraw };
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

  // keep as closure since may need local state in future - such as hovered on atom
  // for highlighting
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
        viewerRef.current.__viewer__ = viewer; // !! ATTACH VIEWER TO DOM ELEMENT !!

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
    if (uniprotId) fetchStructure();
    return () => {
      hideAtomInfo();
      viewer?.clear();
    };
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
          <Box position="relative" pb={2}>
            <Typography variant="body2" sx={{ pb: 1 }}>
              AlphaFold prediction XXXX with variant (reference allele) highlighted. Maximum variant
              effect for position: {maxVariantEffect}.
            </Typography>
            <Typography variant="subtitle2">Molecule</Typography>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label="cartoon" />
              <FormControlLabel required control={<Checkbox />} label="ball and stick" />
              <FormControlLabel disabled control={<Checkbox />} label="surface" />
            </FormGroup>
            <Typography variant="subtitle2">Variant</Typography>
            <FormGroup>
              <FormControlLabel
                required
                control={<Checkbox defaultChecked />}
                label="ball and stick"
              />
              <FormControlLabel disabled control={<Checkbox defaultChecked />} label="surface" />
            </FormGroup>
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

{
  /* {isAlphaFold(selectedStructure) && <AlphaFoldLegend />} */
}

export default Body;
