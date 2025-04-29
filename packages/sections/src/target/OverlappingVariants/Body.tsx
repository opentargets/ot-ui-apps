import { useQuery } from "@apollo/client";
import { SectionItem, OtTable, Link } from "ui";
import { naLabel } from "@ot/constants";
import { Box, Button, Grid, Typography } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import { getUniprotIds, nanComparator } from "@ot/utils";
import { createViewer } from "3dmol";
// import { parseCif } from "./parseCif";
// import { schemeSet1, schemeDark2 } from "d3";
import OVERLAPPING_VARIANTS_QUERY from "./OverlappingVariantsQuery.gql";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const alphaFoldResultsStem = "https://alphafold.ebi.ac.uk/api/prediction/";
const alphaFoldStructureStem = "https://alphafold.ebi.ac.uk/files/";
const alphaFoldStructureSuffix = "-model_v4.cif";

function Body({ id: ensemblId, label: symbol, entity }) {
  const [viewer, setViewer] = useState(null);
  const [structureLoading, setStructureLoading] = useState(true);

  const viewerRef = useRef(null);
  const structureInfoRef = useRef(null);
  const atomInfoRef = useRef(null);
  const messageRef = useRef(null);

  const variables = { ensemblId };
  const request = useQuery(OVERLAPPING_VARIANTS_QUERY, {
    variables,
  });

  const columns = [
    {
      // !! NEED TO DISPLAY, SORT, ... PROPERLY, AND LINK TO VARIANT !!
      id: "variantId",
      label: "Variant",
    },
    {
      // !! MAKE NUMERIC, CHECK SORTING !!
      id: "aminoAcidPosition", // UPDATE TYPO ONCE API UPDATED
      label: "Amino acid position",
      sortable: true,
    },
    {
      // !! WHAT IF VARIANT GREATER THAN LENGTH 1 - SHOULD BE SHOWING REF AND ALT ALLELES !!
      id: "referenceAmionAcid",
      label: "Reference amino acids",
      sortable: true,
    },
    {
      id: "alternateAmionAcid", // UPDATE TYPO ONCE API UPDATED
      label: "Alternate amino acids",
      sortable: true,
    },
    // !! MORE ROWS !!
  ];

  // function getSelectedRows(selectedRows) {
  //   selectedRows.length > 0 && setSelectedStructure(selectedRows[0]?.original);
  // }

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

  function clearStructureInfo() {
    structureInfoRef.current?.querySelectorAll("span")?.forEach(span => (span.textContent = ""));
  }

  // if (!experimentalResults) return null;

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      // variables??
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={() => {
        return (
          <Grid container columnSpacing={2}>
            {/* <Grid item xs={12} lg={6}> */}
            <Grid item xs={12}>
              <OtTable
                dataDownloader
                showGlobalFilter
                sortBy="aminoAcidPosition"
                order="desc"
                columns={columns}
                loading={request.loading}
                rows={request.data?.target.proteinCodingCoordinates.rows}
                // getSelectedRows={getSelectedRows}
                query={OVERLAPPING_VARIANTS_QUERY.loc.source.body}
                variables={variables}
              />
            </Grid>
            {/* <Grid item xs={12} lg={6}>
              <Box
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
              </Box>
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
                      <Typography variant="caption" component="p" textAlign="right" />
                    </Box>
                  </Box>
                </Box>
              </Box>
              {isAlphaFold(selectedStructure) && <AlphaFoldLegend />}
            </Grid> */}
          </Grid>
        );
      }}
    />
  );
}

export default Body;
