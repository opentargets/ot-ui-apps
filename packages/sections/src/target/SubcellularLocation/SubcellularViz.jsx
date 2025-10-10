import { lazy, useEffect, useRef, Suspense, useState } from "react";
import { Typography, List, ListItem, Box, Tabs, Tab, Skeleton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import { Link } from "ui";
import { identifiersOrgLink, getUniprotIds } from "@ot/utils";
import SwissBioVis from "./SwissbioViz";
import membraneCodes from "./membrane-codes";

// Remove the 'SL-' from a location termSL (e.g. "SL-0097")
// The sib-swissbiopics component (different from what is documented)
// actually doesn't accept the "SL-" part of the term
const parseLocationTerm = term => term?.substring(3);

// Parse termSL to specific id format used by the text for rollovers
const parseTermToTextId = term => (term ? `${term.replace("-", "")}term` : "");

// Parse API response and split locations based on sources. Example:
// { HPA_main: [], uniprot: [], }
const parseLocationData = subcellularLocations => {
  const sourcesLocations = {};
  subcellularLocations
    .filter(sl => sl.termSL)
    .forEach(sl => {
      if (!sourcesLocations[sl.source]) {
        sourcesLocations[sl.source] = [];
      }
      sourcesLocations[sl.source].push(sl);
    });
  return sourcesLocations;
};

// Filter the sources array to only those with data
const filterSourcesWithData = (sources, sourcesLocations) =>
  sources.filter(s => sourcesLocations[s.id]);

const getTabId = id => `${id}-tab`;

function LocationLink({ sourceId, id }) {
  return (
    <Link external to={identifiersOrgLink(sourceId === "uniprot" ? "uniprot" : "hpa", id)}>
      {id}
    </Link>
  );
}

/**
 * The text list of locations displayed to the right of the visualiztion
 */
function LocationsList({ sls, hoveredCellPart, setHoveredCellPart }) {
  return (
    <List>
      {sls.map(({ location, termSL }) => {
        const locationCode = parseLocationTerm(membraneCodes[termSL]?.parentCode ?? termSL);
        return (
          <ListItem
            key={location}
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: 1,
              cursor: "default",
              color: (theme) => theme.palette.primary[
                hoveredCellPart === locationCode ? "dark" : "main"
              ]
            }}
            onMouseEnter={() => setHoveredCellPart(locationCode)}
            onMouseLeave={() => setHoveredCellPart(null)}
          >
            <span>
              <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" />
            </span>
            <Typography variant="body2">
              <strong>{location}</strong>
            </Typography>
          </ListItem>
        );
      })}
    </List>
  );
}

/**
 * SubcellularVizTabs wraps the MUI tabs to separate the state and
 * trigger tab panels visibility on/off without using the state
 * as this crashes the swissbiopic widget - see note below
 * @param {*} sources the array of source to show in the tabs (i.e. those with data)
 */
function SubcellularVizTabs({ sources: activeSources, children }) {
  const [activeTab, setActiveTab] = useState(0);
  const onTabChange = (event, tabId) => {
    setActiveTab(tabId);
  };
  useEffect(() => {
    // update tab panels visibility: we change the style of the DOM element directly
    // to avoid any re-rendering as that causes the swissbiopic component to crash
    children.forEach(child => {
      child.ref.current.setAttribute("style", "display:none");
    });
    children[activeTab].ref.current.setAttribute("style", "display:block");
  });

  return (
    <>
      <Tabs value={activeTab} onChange={onTabChange} aria-label="Subcellular location sources">
        {activeSources.map((s, i) => (
          <Tab label={s.label} value={i} key={s.id} />
        ))}
      </Tabs>
      {children}
    </>
  );
}

/**
 * A wrapper for the SwissbioViz component
 * @param {*} data the target object as returned by the API
 */
function SubcellularViz({ data: target }) {
  const [hoveredCellPart, setHoveredCellPart] = useState(null);

  // const classes = useStyles();
  // define the sources here so we can have call useRef() and then pass it to the tabs panels
  const sources = [
    {
      id: "HPA_main",
      label: "HPA main location",
      ref: useRef(),
    },
    {
      id: "HPA_additional",
      label: "HPA additional location",
      ref: useRef(),
    },
    {
      id: "HPA_extracellular_location",
      label: "HPA extracellular location",
      ref: useRef(),
    },
    {
      id: "uniprot",
      label: "UniProt",
      ref: useRef(),
    },
  ];
  const uniprotId = getUniprotIds(target.proteinIds)[0];
  const sourcesLocations = parseLocationData(target.subcellularLocations);
  const activeSources = filterSourcesWithData(sources, sourcesLocations);

  return (
    <div>
      <SubcellularVizTabs sources={activeSources}>
        {activeSources.map(s => (
          <div
            value={getTabId(s.id)}
            id={getTabId(s.id)}
            ref={s.ref}
            key={s.id}
            role="tabpanel"
          >
            <Suspense fallback={<Skeleton height={400} />}>
              <Box sx={{ display: "flex", gap: 4, mt: 4 }} >
                <SwissBioVis
                  taxonId="9606"
                  locationIds={sourcesLocations[s.id].map(l => parseLocationTerm(l.termSL)).join()}
                  sourceId={s.id.toLowerCase()}
                  hoveredCellPart={hoveredCellPart}
                  setHoveredCellPart={setHoveredCellPart}
                />
                <Box
                  key={s.id}
                  sx={{ width: { xs: "55%", sm: "45%" }, flexGrow: 0 }}
                >
                  <Typography variant="h6">{s.label}</Typography>
                  Location for{" "}
                  <LocationLink sourceId={s.id} id={s.id === "uniprot" ? uniprotId : target.id} />
                  <LocationsList
                    sls={sourcesLocations[s.id]}
                    hoveredCellPart={hoveredCellPart}
                    setHoveredCellPart={setHoveredCellPart}
                  />
                </Box>
              </Box>
            </Suspense>
          </div>
        ))}
      </SubcellularVizTabs>
    </div>
  );
}

export default SubcellularViz;
