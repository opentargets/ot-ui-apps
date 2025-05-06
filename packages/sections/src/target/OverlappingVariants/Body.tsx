import { useQuery } from "@apollo/client";
import { SectionItem, OtTable, Link, Tooltip } from "ui";
import { naLabel } from "@ot/constants";
import { Box, Button, Grid, Typography } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import { createViewer } from "3dmol";
// import { schemeSet1, schemeDark2 } from "d3";
import OVERLAPPING_VARIANTS_QUERY from "./OverlappingVariantsQuery.gql";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const alphaFoldStructureStem = "https://alphafold.ebi.ac.uk/files/";
const alphaFoldStructureSuffix = "-model_v4.cif";

// !! IMPORT ALPHAFOLD CONFIDENCE STUFF AND LEGEND  FROM UI MERGED FROM OTHER BRANCH !!
const alphaFoldConfidenceBands = [
  { lowerLimit: 90, label: "Very high", sublabel: "pLDDT > 90", color: "rgb(0, 83, 214)" },
  {
    lowerLimit: 70,
    label: "Confident",
    sublabel: "90 > pLDDT > 70",
    color: "rgb(101, 203, 243)",
  },
  { lowerLimit: 50, label: "Low", sublabel: "70 > pLDDT > 50", color: "rgb(255, 219, 19)" },
  { lowerLimit: 0, label: "Very low ", sublabel: "pLDDT < 50", color: "rgb(255, 125, 69)" },
];
function getAlphaFoldConfidence(atom, propertyName = "label") {
  for (const obj of alphaFoldConfidenceBands) {
    if (atom.b > obj.lowerLimit) return obj[propertyName];
  }
  return alphaFoldConfidenceBands[0][propertyName];
}
function AlphaFoldLegend() {
  return (
    <Box mt={2} display="flex">
      <Box display="flex" flexDirection="column" ml={2} gap={0.75}>
        <Typography variant="subtitle2">Model Confidence</Typography>
        <Box display="flex" gap={3.5}>
          {alphaFoldConfidenceBands.map(({ label, sublabel, color }) => (
            <Box key={label}>
              <Box display="flex" gap={0.75} alignItems="center">
                <Box width="12px" height="12px" bgcolor={color} />
                <Box display="flex" flexDirection="column">
                  <Typography variant="caption" fontWeight={500} lineHeight={1}>
                    {label}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" fontSize={11.5} lineHeight={1}>
                {sublabel}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="caption" mt={1}>
          AlphaFold produces a per-residue model confidence score (pLDDT) between 0 and 100. Some
          regions below 50 pLDDT may be unstructured in isolation.
        </Typography>
      </Box>
    </Box>
  );
}

function middleElement(arr) {
  return arr[Math.floor(arr.length / 2)];
}

function Body({ id: ensemblId, label: symbol, entity }) {
  const [molViewer, setMolViewer] = useState(null);
  const [structureLoading, setStructureLoading] = useState(true);

  const viewerRef = useRef(null);
  const structureInfoRef = useRef(null);
  const atomInfoRef = useRef(null);
  const messageRef = useRef(null);

  const variables = { ensemblId };
  const request = useQuery(OVERLAPPING_VARIANTS_QUERY, {
    variables,
  });

  const gqlData = request?.data?.target;
  const proteinCodingCoordinates = gqlData?.proteinCodingCoordinates;
  const variantsByStartingPosition = Map.groupBy(
    proteinCodingCoordinates?.rows ?? [],
    row => row.aminoAcidPosition
  );

  const columns = [
    {
      // !! NEED TO DISPLAY, SORT, ... PROPERLY, AND LINK TO VARIANT !!
      id: "variant.id",
      label: "Variant",
    },
    {
      id: "aminoAcidPosition", // UPDATE TYPO ONCE API UPDATED
      label: "Amino acid change",
      sortable: true,
      filterValue: o => `${o.referenceAminoAcid}${o.aminoAcidPosition}${o.alternateAminoAcid}`,
      renderCell: o => `${o.referenceAminoAcid}${o.aminoAcidPosition}${o.alternateAminoAcid}`,
      comparator: (a, b) => a.aminoAcidPosition - b.aminoAcidPosition,
    },
    {
      id: "evidenceSources",
      label: "Evidence counts",
      renderCell: ({ evidenceSources }) => {
        if (evidenceSources?.length > 0) {
          return evidenceSources
            .map(({ evidenceCount, datasourceId }) => `${datasourceId}: ${evidenceCount}`)
            .join(", ");
        }
        return naLabel;
      },
    },
    {
      // MAKE NUMERIC
      id: "maxVariantEffectForPosition",
      label: "Max variant effect for position",
      renderCell: ({ maxVariantEffectForPosition: { method, value } }) =>
        `${method}: ${value.toFixed(2)}`,
      comparator: (a, b) =>
        a.maxVariantEffectForPosition.value - b.maxVariantEffectForPosition.value,
    },
    {
      id: "diseases",
      label: "Disease/phenotype",
      filterValue: ({ diseases }) => diseases.map(({ name }) => name).join(", "),
      renderCell: ({ diseases }) => {
        if (diseases.length === 0) return naLabel;
        const elements = [<Link to={`/disease/${diseases[0].id}`}>{diseases[0].name}</Link>];
        if (diseases.length > 1) {
          elements.push(", ", <Link to={`/disease/${diseases[1].id}`}>{diseases[1].name}</Link>);
          if (diseases.length > 2) {
            elements.push(
              <Tooltip
                title={diseases
                  .slice(2)
                  .map(({ id, name }) => <Link to={`/disease/${id}`}>{name}</Link>)
                  .reduce((accum, current) => {
                    accum.push(current, ", ");
                    return accum;
                  }, [])}
                showHelpIcon
              >
                <Typography variant="caption" ml={1}>
                  +{diseases.length - 2} more
                </Typography>
              </Tooltip>
            );
          }
        }
        return elements;
      },
    },

    // !! MORE ROWS !!
  ];

  // function getSelectedRows(selectedRows) {
  //   selectedRows.length > 0 && setSelectedStructure(selectedRows[0]?.original);
  // }

  // function hideAtomInfo() {
  //   if (atomInfoRef.current) atomInfoRef.current.style.display = "none";
  // }

  function getFilteredRows(filteredRows) {
    if (molViewer) {
      highlightVariants(
        molViewer,
        filteredRows.map(row => row.original)
      );
    }
  }

  function getEnteredRow(enteredRow) {
    if (molViewer) {
      highlightVariantFromTable(molViewer, enteredRow.original);
    }
  }

  function getExitedRow(exitedRow) {
    if (molViewer) {
      removeExtraHighlightVariant(molViewer, exitedRow.original);
    }
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

  function resetViewer(viewer, duration = 0) {
    viewer.zoomTo({}, duration);
    viewer.zoom(10);
  }

  // function addVariantStyle(viewer, variantResidues) {
  //   for (const resis of variantResidues) {
  //     viewer.addStyle(
  //       { resi: [...resis] },
  //       {
  //         stick: { radius: 0.2, colorfunc: a => getAlphaFoldConfidence(a, "color") },
  //         sphere: { radius: 0.4, colorfunc: a => getAlphaFoldConfidence(a, "color") },
  //       }
  //     );
  //   }
  // }

  function setNoHoverStyle(viewer) {
    viewer.setStyle(
      {},
      {
        cartoon: {
          colorfunc: a => getAlphaFoldConfidence(a, "color"),
          arrows: true,
          // opacity: 0.6,
        },
      }
    );
    // addVariantStyle(viewer);
  }

  function highlightVariants(viewer, filteredRows) {
    for (const [resi, shape] of viewer.__highlightedResis__) {
      viewer.removeShape(shape);
      viewer.__highlightedResis__.delete(resi);
    }
    // viewer.removeAllShapes();
    // !! CAN PROBABLY AVOID DOING THIS EVERY TIME
    const variantsByStartingPosition = Map.groupBy(filteredRows, row => row.aminoAcidPosition);
    for (const [startPosition, rows] of variantsByStartingPosition) {
      // viewer.addSurface("VDW", { opacity: 0.65, color: "#f00" }, { resi: [...resis] });
      const carbonAtoms = viewer.__atomsByResi__
        .get(startPosition)
        .filter(atom => atom.elem === "C");
      // const sphereAtom = middleElement(carbonAtoms);
      const sphereAtom = carbonAtoms[0]; // !! WHY IS FIRST CARBON NEARER CARTOON THAN MIDDLE CARBON?
      let hoverSphere;
      viewer.__highlightedResis__.set(
        startPosition,
        viewer.addSphere({
          center: { x: sphereAtom.x, y: sphereAtom.y, z: sphereAtom.z },
          radius: 1.5,
          color: "#f00",
          opacity: 0.85,
          clickable: true,
          callback: () => console.log("clicked"),
          hoverable: true,
          hover_callback: sphere => {
            console.log("HOVER");
            !! WHY IS ADDING SPHERE NOT WORKING ??
            hoverSphere = viewer.addSphere({
              center: { x: sphereAtom.x, y: sphereAtom.y, z: sphereAtom.z },
              radius: 3,
              color: "#00f",
              opacity: 1,
              // !! ADD CLICKABLE AND CALLBACK TO THIS SPHERE !!
            });
          },
          unhover_callback: () => {
            viewer.removeShape(hoverSphere);
          },
        })
      );
    }
    viewer.render();
  }

  function highlightVariantFromTable(viewer, row) {
    // console.log(row);
    const startPosition = row.aminoAcidPosition;

    if (!viewer.__extraHighlightedResis__.has(startPosition)) {
      const carbonAtoms = viewer.__atomsByResi__
        .get(startPosition)
        .filter(atom => atom.elem === "C");
      // const sphereAtom = middleElement(carbonAtoms);
      const sphereAtom = carbonAtoms[0]; // !! WHY IS FIRST CARBON NEARER CARTOON THAN MIDDLE CARBON?
      viewer.__extraHighlightedResis__.set(
        startPosition,
        viewer.addSphere({
          center: { x: sphereAtom.x, y: sphereAtom.y, z: sphereAtom.z },
          radius: 3,
          color: "#0f0",
          opacity: 1,
        })
      );
      viewer.render();
    }
  }

  function unhighlightVariantFromTable(viewer, row) {
    const startPosition = row.aminoAcidPosition;
    if (viewer.__extraHighlightedResis__.has(startPosition)) {
      viewer.removeShape(viewer.__extraHighlightedResis__.get(startPosition));
      viewer.__extraHighlightedResis__.delete(startPosition);
      viewer.render();
    }
  }

  // function highlightVariantonHover(viewer, )

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
      const uniprotIds = [...(proteinCodingCoordinates?.rows?.[0]?.uniprotAccessions ?? [])];
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
        setMolViewer(viewer);
        // viewerRef.current.__viewer__ = viewer;
        const hoverDuration = 10;
        // viewer.getCanvas().ondblclick = () => resetViewer(viewer, 200); // use ondblclick so replaces existing
        viewer.addModel(data, "cif"); /* load data */
        viewer.setHoverDuration(hoverDuration);
        // const hoverArgs = hoverManagerFactory({ viewer, atomInfoRef });
        // const hideAtomInfo = hoverArgs[3];
        // viewer.getCanvas().onmouseleave = () => {
        //   setTimeout(hideAtomInfo, hoverDuration + 50);
        // };
        // viewer.setHoverable(...hoverArgs);
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
        const viewerAtoms = viewer.getModel().selectedAtoms();
        viewer.__atomsByResi__ = Map.groupBy(viewerAtoms, atom => atom.resi);
        viewer.__highlightedResis__ = new Map();
        viewer.__extraHighlightedResis__ = new Map();
        highlightVariants(viewer, proteinCodingCoordinates?.rows ?? []);
        resetViewer(viewer);
        // viewer.zoom(0.2);
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
  }, [proteinCodingCoordinates, setMolViewer]);

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
              {/* <Grid item xs={12} lg={6}> */}
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
              <AlphaFoldLegend />
            </Grid>
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
                getFilteredRows={getFilteredRows}
                getEnteredRow={getEnteredRow}
                getExitedRow={getExitedRow}
              />
            </Grid>
          </Grid>
        );
      }}
    />
  );
}

export default Body;
