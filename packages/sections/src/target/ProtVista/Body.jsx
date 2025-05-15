import { useQuery } from "@apollo/client";
import { SectionItem, OtTable, Link } from "ui";
import { naLabel } from "@ot/constants";
import { Box, Button, Grid, Typography } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import { getUniprotIds, nanComparator } from "@ot/utils";
import { createViewer } from "3dmol";
import { parseCif } from "./parseCif";
import { schemeSet1, schemeDark2 } from "d3";
import PROTVISTA_QUERY from "./ProtVista.gql";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const experimentalResultsStem = "https://www.ebi.ac.uk/proteins/api/proteins/";
const experimentalStructureStem = "https://www.ebi.ac.uk/pdbe/entry-files/download/";
const experimentalStructureSuffix = ".cif";
const alphaFoldResultsStem = "https://alphafold.ebi.ac.uk/api/prediction/";
const alphaFoldStructureStem = "https://alphafold.ebi.ac.uk/files/";
const alphaFoldStructureSuffix = "-model_v4.cif";

function getSegments(id, chainsAndPositions) {
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
    rawString: chainsAndPositions, // !! REMOVE !!
    chainsString: printChains.join(", "),
    segmentsString: printSegments.join(", "),
    details,
    uniqueChains: new Set(Object.keys(details)),
    maxLengthSegment,
  };
}

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

function getConfidence(atom, propertyName = "label") {
  for (const obj of alphaFoldConfidenceBands) {
    if (atom.b > obj.lowerLimit) return obj[propertyName];
  }
  return alphaFoldConfidenceBands[0][propertyName];
}

const chainColorScheme = [
  ...schemeDark2.slice(0, -1),
  ...[1, 2, 3, 4, 0, 6, 7].map(i => schemeSet1[i]),
];

function zipToObject(arr1, arr2) {
  const obj = {};
  if (!Array.isArray(arr1)) arr1 = [arr1];
  if (!Array.isArray(arr2)) arr2 = [arr2];
  arr1.forEach((value, index) => (obj[value] = arr2[index]));
  return obj;
}

function isAlphaFold(selectedStructure) {
  return selectedStructure?.type?.toLowerCase?.() === "alphafold";
}

function AlphaFoldLegend() {
  return (
    <Box display="flex">
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

// keep as closure since may need local state in future - such as hovered on atom
// for highlighting
function hoverManagerFactory({
  viewer,
  atomInfoRef,
  parsedCif,
  showModel,
  chainToEntityDesc,
  isAF,
}) {
  return [
    {},
    true,
    atom => {
      const infoElmt = atomInfoRef.current;
      if (infoElmt) {
        infoElmt.style.display = "block";
        const fieldElmts = [...infoElmt.querySelectorAll("p")];
        const pdbModel = parsedCif["_atom_site.pdbx_PDB_model_num"][atom.index];
        const authChain = parsedCif["_atom_site.auth_asym_id"][atom.index];
        const pdbChain = parsedCif["_atom_site.label_asym_id"][atom.index];
        const authAtom = parsedCif["_atom_site.auth_seq_id"][atom.index];
        const pdbAtom = parsedCif["_atom_site.label_seq_id"][atom.index];
        fieldElmts[0].textContent = chainToEntityDesc[pdbChain];
        fieldElmts[1].textContent = `${showModel ? `Model: ${pdbModel} | ` : ""}${pdbChain}${
          authChain && authChain !== pdbChain ? ` (auth: ${authChain})` : ""
        } | ${atom.resn} ${pdbAtom}${
          authAtom && authAtom !== pdbAtom ? ` (auth: ${authAtom})` : ""
        }`;
        fieldElmts[2].textContent = isAF ? `Confidence: ${atom.b} (${getConfidence(atom)})` : "";
      }
    },
    () => {
      if (atomInfoRef.current) {
        atomInfoRef.current.style.display = "none";
      }
    },
  ];
}

function Body({ id: ensemblId, label: symbol, entity }) {
  const [experimentalResults, setExperimentalResults] = useState(null);
  const [segments, setSegments] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [structureLoading, setStructureLoading] = useState(true);

  const viewerRef = useRef(null);
  const structureInfoRef = useRef(null);
  const atomInfoRef = useRef(null);
  const messageRef = useRef(null);

  const variables = { ensemblId };
  const request = useQuery(PROTVISTA_QUERY, {
    variables,
  });

  const uniprotId = request?.data?.target
    ? getUniprotIds(request?.data?.target?.proteinIds)?.[0]
    : null;

  const columns = [
    {
      id: "id",
      label: "ID",
      sortable: true,
    },
    {
      id: "properties.method",
      label: "Method",
      sortable: true,
    },
    {
      id: "properties.resolution",
      label: "Resolution",
      sortable: true,
      numeric: true,
      filterValue: false,
      comparator: nanComparator(
        (a, b) => a - b,
        row => +row?.properties?.resolution?.replace(/\s*A/, ""),
        false
      ),
      renderCell: ({ properties: { resolution } }) => {
        return resolution != null ? resolution.replace("A", "Å") : naLabel;
      },
      exportValue: ({ properties: { resolution } }) => {
        return resolution?.replace("A", "Å");
      },
    },
    {
      id: "properties.chains",
      label: "Chain",
      filterValue: false,
      renderCell: ({ id }) => segments[id].chainsString,
      exportValue: ({ id }) => segments[id].chainsString,
    },
    {
      id: "positions",
      label: "Positions",
      sortable: true,
      comparator: (a, b) => {
        return segments?.[a?.id]?.maxLengthSegment - segments?.[b?.id]?.maxLengthSegment;
      },
      renderCell: ({ id }) => segments[id].segmentsString,
      exportValue: ({ id }) => segments[id].segmentsString,
    },
    {
      id: "type",
      label: "Source",
      sortable: true,
      renderCell: ({ id, type }) => {
        const url = isAlphaFold({ type })
          ? `https://www.alphafold.ebi.ac.uk/entry/${uniprotId}`
          : `https://www.ebi.ac.uk/pdbe/entry/pdb/${id}`;
        return (
          <Link external to={url}>
            {type}
          </Link>
        );
      },
    },
  ];

  function getSelectedRows(selectedRows) {
    selectedRows.length > 0 && setSelectedStructure(selectedRows[0]?.original);
  }

  function hideAtomInfo() {
    if (atomInfoRef.current) atomInfoRef.current.style.display = "none";
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

  // fetch experimental results
  useEffect(() => {
    const results = [];
    async function fetchAlphaFoldResults() {
      if (uniprotId) {
        try {
          const response = await fetch(`${alphaFoldResultsStem}${uniprotId}`);
          if (!response.ok) {
            console.error(`Response status (AlphaFold request): ${response.status}`);
          } else {
            const json = await response.json();
            if (json.length > 0) {
              results.unshift({
                id: json[0].entryId,
                type: "AlphaFold",
                properties: {
                  chains: `A=${json[0].uniprotStart}-${json[0].uniprotEnd}`,
                  method: "Prediction",
                  resolution: undefined,
                },
              });
            }
          }
        } catch (error) {
          console.error(error.message);
        }
      }
    }
    async function fetchExperimentalResults() {
      if (uniprotId) {
        try {
          const response = await fetch(`${experimentalResultsStem}${uniprotId}`);
          if (!response.ok) {
            console.error(`Response status (PDB request): ${response.status}`);
          } else {
            const json = await response.json();
            const pdbResults = json?.dbReferences?.filter(row => row.type === "PDB") ?? [];
            results.push(...pdbResults);
          }
        } catch (error) {
          console.error(error.message);
        }
      }
    }
    async function fetchAllResults() {
      await Promise.allSettled([fetchAlphaFoldResults(), fetchExperimentalResults()]);
      if (results.length) {
        setExperimentalResults(results);
        const _segments = {};
        for (const row of results) {
          _segments[row.id] = getSegments(row.id, row.properties.chains);
        }
        setSegments(_segments);
        setSelectedStructure(results[0]);
      }
    }
    fetchAllResults();
    return () => {
      setExperimentalResults(null);
      setSegments(null);
      setSelectedStructure(null);
    };
  }, [uniprotId, setExperimentalResults, setSegments, setSelectedStructure]);

  // create viewer
  useEffect(() => {
    if (viewerRef.current && experimentalResults) {
      setViewer(
        createViewer(viewerRef.current, {
          backgroundColor: "#f8f8f8",
          antialias: true,
          cartoonQuality: 10,
        })
      );
    }
    return () => {
      viewer?.clear();
      setViewer(null);
    };
  }, [experimentalResults, setViewer]);

  // fetch selected structure and view it
  useEffect(() => {
    async function fetchStructure() {
      if (selectedStructure && viewer) {
        clearStructureInfo();
        showLoadingMessage();

        const isAF = isAlphaFold(selectedStructure);
        const pdbUri = isAF
          ? `${alphaFoldStructureStem}${selectedStructure.id}${alphaFoldStructureSuffix}`
          : `${experimentalStructureStem}${selectedStructure.id.toLowerCase()}${experimentalStructureSuffix}`;

        try {
          const response = await fetch(pdbUri);
          if (!response.ok) {
            console.error(`Response status (CIF request): ${response.status}`);
            showLoadingMessage("Failed to download structure data");
          } else {
            let data, parsedCif;
            try {
              data = await response.text();
              parsedCif = parseCif(data)[selectedStructure.id];
            } catch (error) {
              console.error(error.message);
              showLoadingMessage("Failed to parse structure data");
            }
            if (data && parsedCif) {
              if (structureInfoRef.current) {
                const [idElmt, titleElmt] = structureInfoRef.current.querySelectorAll("span");
                const title = isAF ? "AlphaFold prediction" : parsedCif["_struct.title"] ?? "";
                idElmt.textContent = `${selectedStructure.id}${title ? ":" : ""}`;
                titleElmt.textContent = title;
              }

              // pdb <-> auth chains
              // - may only need pdb -> auth, but is 1-to-many so get auth->pdb first
              let authToPdbChain = null;
              let pdbToAuthChain = null;
              {
                const authChains = parsedCif["_atom_site.auth_asym_id"];
                if (authChains) {
                  const pdbChains = parsedCif["_atom_site.label_asym_id"];
                  const authChainsToMap = new Set(authChains);
                  authToPdbChain = {};
                  for (const [index, pdbChain] of pdbChains.entries()) {
                    const authChain = authChains[index];
                    if (authChainsToMap.has(authChain)) {
                      authToPdbChain[authChain] = pdbChain;
                      authChainsToMap.delete(authChain);
                      if (authChainsToMap.size === 0) break;
                    }
                  }
                  pdbToAuthChain = {};
                  for (const [authChain, pdbChain] of Object.entries(authToPdbChain)) {
                    pdbToAuthChain[pdbChain] ??= [];
                    pdbToAuthChain[pdbChain].push(authChain);
                  }
                }
              }

              // structure chains - pdb chain names
              const structureChains = parsedCif["_pdbx_struct_assembly_gen.asym_id_list"];
              let firstStructureChains;
              let firstStructureTargetChains = [];
              let firstStructureNonTargetChains = [];
              let otherStructureChains;
              const targetChains = segments[selectedStructure.id].uniqueChains; // auth names
              const targetChainsPdb = new Set(
                [...targetChains].map(chain => authToPdbChain[chain])
              );
              if (structureChains) {
                if (Array.isArray(structureChains)) {
                  firstStructureChains = structureChains[0].split(",");
                  otherStructureChains = structureChains.slice(1).join(",").split(",");
                  const firstStructureChainsSet = new Set(firstStructureChains);
                  otherStructureChains = otherStructureChains.filter(
                    chain => !firstStructureChainsSet.has(chain)
                  );
                } else {
                  firstStructureChains = structureChains.split(",");
                  otherStructureChains = [];
                }
                for (const chain of firstStructureChains) {
                  (targetChainsPdb.has(chain)
                    ? firstStructureTargetChains
                    : firstStructureNonTargetChains
                  ).push(chain);
                }
              } else {
                const allChains = new Set(parsedCif["_atom_site.label_asym_id"]);
                firstStructureChains = [...allChains];
                firstStructureTargetChains.push(...targetChainsPdb);
                firstStructureNonTargetChains = firstStructureChains.filter(
                  chain => !targetChainsPdb.has(chain)
                );
                otherStructureChains = [];
              }
              if (pdbToAuthChain) {
                firstStructureChains = firstStructureChains
                  .map(chain => pdbToAuthChain[chain])
                  .flat();
                firstStructureTargetChains = firstStructureTargetChains
                  .map(chain => pdbToAuthChain[chain])
                  .flat();
                firstStructureNonTargetChains = firstStructureNonTargetChains
                  .map(chain => pdbToAuthChain[chain])
                  .flat();
                otherStructureChains = otherStructureChains
                  .map(chain => pdbToAuthChain[chain])
                  .flat();
              }

              // entities
              const entityIdToDesc = zipToObject(
                parsedCif["_entity.id"],
                parsedCif["_entity.pdbx_description"]
              );
              const chainToEntityId = zipToObject(
                parsedCif["_struct_asym.id"],
                parsedCif["_struct_asym.entity_id"]
              );
              const chainToEntityDesc = {};
              for (const chain of parsedCif["_struct_asym.id"]) {
                chainToEntityDesc[chain] = entityIdToDesc[chainToEntityId[chain]];
              }

              const scheme = {};
              if (!isAF) {
                firstStructureTargetChains.forEach((chain, index) => {
                  scheme[chain] = chainColorScheme[index % chainColorScheme.length];
                });
              }

              function resetViewer(duration = 0) {
                viewer.zoomTo(
                  {
                    chain: firstStructureTargetChains.length
                      ? firstStructureTargetChains
                      : firstStructureChains,
                  },
                  duration
                );
                viewer.zoom(isAlphaFold(selectedStructure) ? 1.4 : 1, duration);
              }

              const hoverDuration = 50;
              viewer.getCanvas().onmouseleave = () => {
                setTimeout(hideAtomInfo, hoverDuration + 50);
              };
              viewer.getCanvas().ondblclick = () => resetViewer(200); // use ondblclick so replaces existing
              viewer.addModel(data, "cif"); /* load data */
              viewer.setHoverDuration(hoverDuration);
              viewer.setHoverable(
                ...hoverManagerFactory({
                  viewer,
                  atomInfoRef,
                  parsedCif,
                  showModel: new Set(parsedCif["_atom_site.pdbx_PDB_model_num"]).size > 1,
                  chainToEntityDesc,
                  isAF,
                })
              );

              if (isAF) {
                viewer.setStyle(
                  {},
                  {
                    cartoon: {
                      colorfunc: atom => getConfidence(atom, "color"),
                      arrows: true,
                    },
                  }
                );
              } else {
                viewer.setStyle(
                  { chain: firstStructureTargetChains },
                  { cartoon: { colorfunc: atom => scheme[atom.chain], arrows: true } }
                );
                viewer.setStyle(
                  { chain: firstStructureNonTargetChains },
                  {
                    cartoon: {
                      color: "#eee",
                      arrows: true,
                      opacity: 0.8,
                    },
                  }
                );
                viewer.getModel().setStyle({ chain: otherStructureChains }, { hidden: true });
              }
              resetViewer();
              viewer.render();
              hideLoadingMessage();
            }
          }
        } catch (error) {
          console.error(error.message);
          showLoadingMessage("Failed to download structure data");
        }
      }
    }
    fetchStructure();
    return () => {
      hideAtomInfo();
      viewer?.clear();
    };
  }, [selectedStructure, viewer, segments]);

  if (!uniprotId) return null;

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={() => {
        if (!experimentalResults && !request.loading && uniprotId)
          return <NoStructureAvailable uniprotId={uniprotId} />;

        return (
          <Grid container columnSpacing={2}>
            <Grid item xs={12} lg={6}>
              <OtTable
                dataDownloader
                showGlobalFilter
                sortBy="positions"
                order="desc"
                columns={columns}
                loading={request.loading}
                rows={experimentalResults}
                getSelectedRows={getSelectedRows}
                query={PROTVISTA_QUERY.loc.source.body}
                variables={variables}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
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
            </Grid>
          </Grid>
        );
      }}
    />
  );
}

function NoStructureAvailable({ uniprotId }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", fontStyle: "italic" }}>
      No Structure Available for {uniprotId}
    </Box>
  );
}

export default Body;
