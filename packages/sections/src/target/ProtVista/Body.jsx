import { SectionItem, usePlatformApi, OtTable } from "ui";
import { naLabel } from "@ot/constants";
import { Box, colors, Grid, Typography } from "@mui/material";
import Description from "./Description";
import { definition } from ".";
import { getUniprotIds, nanComparator } from "@ot/utils";
import { createViewer, isNumeric } from "3dmol";
import { parseCif } from "./parseCif";
import { schemeSet1, schemeDark2, color as d3Color, max } from "d3";

import PROTVISTA_SUMMARY_FRAGMENT from "./summaryQuery.gql";
import { useState, useEffect, useRef } from "react";
import { property } from "lodash";

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
  ...[1, 2, 3, 4, 0, 6, 7].map(i => schemeSet1[i]),
  ...schemeDark2.slice(0, -1),
];

function zipToObject(arr1, arr2) {
  const obj = {};
  if (!Array.isArray(arr1)) arr1 = [arr1];
  if (!Array.isArray(arr2)) arr2 = [arr2];
  arr1.forEach((value, index) => (obj[value] = arr2[index]));
  return obj;
}

function isAlphaFold(selectedStructure) {
  return selectedStructure?.type?.toLowerCase() === "alphafold";
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

function StructureIdPanel({ selectedStructure }) {
  return (
    <Box
      position="absolute"
      p="0.6rem 0.8rem"
      zIndex={100}
      bgcolor="#f8f8f8c8"
      sx={{ borderBottomRightRadius: "0.2rem" }}
      fontSize={14}
    >
      {selectedStructure?.id}
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
    // 3Dmol's builtin labels
    // atom => {
    //   if (!atom.label) {
    //     atom.label = viewer.addLabel(atom.resn + ":" + atom.atom, {
    //       position: atom,
    //       backgroundColor: "mintcream",
    //       fontColor: "black",
    //     });
    //   }
    // },
    // atom => {
    //   if (atom.label) {
    //     viewer.removeLabel(atom.label);
    //     delete atom.label;
    //   }
    // },

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

function Body({ label: symbol, entity }) {
  const [experimentalResults, setExperimentalResults] = useState(null);
  const [segments, setSegments] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [viewer, setViewer] = useState(null);

  const viewerRef = useRef(null);
  const atomInfoRef = useRef(null);

  const request = usePlatformApi(PROTVISTA_SUMMARY_FRAGMENT);
  const uniprotId = request?.data ? getUniprotIds(request?.data?.proteinIds)?.[0] : null;

  const columns = [
    {
      id: "type",
      label: "Source",
      sortable: true,
    },
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
  ];

  function getSelectedRows(selectedRows) {
    selectedRows.length > 0 && setSelectedStructure(selectedRows[0]?.original);
  }

  function hideAtomInfo() {
    if (atomInfoRef.current) atomInfoRef.current.style.display = "none";
  }

  // fetch experimental results
  useEffect(() => {
    const results = [];
    async function fetchAlphaFoldResults() {
      if (uniprotId) {
        const response = await fetch(`${alphaFoldResultsStem}${uniprotId}`).then(response =>
          response.json()
        );
        if (response.error) throw response.error;
        if (response?.length > 0) {
          results.unshift({
            id: response[0].entryId,
            type: "AlphaFold",
            properties: {
              chains: `A=${response[0].uniprotStart}-${response[0].uniprotEnd}`,
              method: "Prediction",
              resolution: undefined,
            },
          });
        }
      }
    }
    async function fetchExperimentalResults() {
      if (uniprotId) {
        const response = await fetch(`${experimentalResultsStem}${uniprotId}`).then(response =>
          response.json()
        );
        if (response.error) throw response.error;
        const pdbResults = response?.dbReferences?.filter(row => row.type === "PDB") ?? [];
        results.push(...pdbResults);
      }
    }
    async function fetchAllResults() {
      await Promise.all([fetchAlphaFoldResults(), fetchExperimentalResults()]);
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
    // RETURN CLEANUP FUNCTION IF APPROP
  }, [uniprotId, setExperimentalResults, setSegments]);

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
  }, [experimentalResults]);

  // fetch selected structure and view it
  useEffect(() => {
    async function fetchStructure() {
      if (selectedStructure && viewer) {
        hideAtomInfo();
        viewer.clear();
        if (viewerRef.current) {
          viewerRef.current.querySelector("._LoadingMessage").style.display = "flex";
        }

        const isAF = isAlphaFold(selectedStructure);
        const pdbUri = isAF
          ? `${alphaFoldStructureStem}${selectedStructure.id}${alphaFoldStructureSuffix}`
          : `${experimentalStructureStem}${selectedStructure.id.toLowerCase()}${experimentalStructureSuffix}`;
        let data = await (await fetch(pdbUri)).text(); // !! ADD SOME ERROR HANDLING !!

        const parsedCif = parseCif(data)[selectedStructure.id];

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
        const targetChainsPdb = new Set([...targetChains].map(chain => authToPdbChain[chain]));
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
          firstStructureChains = firstStructureChains.map(chain => pdbToAuthChain[chain]).flat();
          firstStructureTargetChains = firstStructureTargetChains
            .map(chain => pdbToAuthChain[chain])
            .flat();
          firstStructureNonTargetChains = firstStructureNonTargetChains
            .map(chain => pdbToAuthChain[chain])
            .flat();
          otherStructureChains = otherStructureChains.map(chain => pdbToAuthChain[chain]).flat();
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
        // viewer.setClickable({}, true, atom => console.log(atom));
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
                smooth: 5,
                style: "parabola",
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

        if (viewerRef.current) {
          viewerRef.current.querySelector("._LoadingMessage").style.display = "none";
        }

        window.viewer = viewer; // !! REMOVE !!
      }
    }
    fetchStructure();
    // RETURN CLEANUP FUNCTION IF APPROP
  }, [selectedStructure, viewer, segments]);

  if (!request.data) return null; // BETTER WAY? - HANDLED BY CC'S CHANGE TO SECTION ITEM IF LOADING?

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={{ ...request, data: { [entity]: request.data } }}
      renderDescription={() => <Description symbol={symbol} />}
      // showContentLoading={true}
      renderBody={() => {
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <OtTable
                dataDownloader
                showGlobalFilter
                // dataDownloaderFileStem={`${studyLocusId}-credibleSets`}
                sortBy="positions"
                order="desc"
                columns={columns}
                loading={!experimentalResults}
                rows={experimentalResults}
                getSelectedRows={getSelectedRows}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box position="relative" display="flex" justifyContent="center" pb={2}>
                <Box ref={viewerRef} position="relative" width="100%" height="400px">
                  <Box
                    className="_LoadingMessage"
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
                  >
                    <Typography variant="body2">Loading structure ...</Typography>
                  </Box>
                  <StructureIdPanel selectedStructure={selectedStructure} />
                  <Box
                    ref={atomInfoRef}
                    position="absolute"
                    bottom={0}
                    right={0}
                    p="0.6rem 0.8rem"
                    zIndex={100}
                    bgcolor="#f8f8f8c8"
                    sx={{ borderTopLeftRadius: "0.2rem" }}
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

export default Body;
