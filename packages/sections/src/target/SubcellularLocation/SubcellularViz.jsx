import { useState } from "react";
import { Typography, List, ListItem, Box, Tabs, Tab, Skeleton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import { Link } from "ui";
import { identifiersOrgLink, getUniprotIds } from "@ot/utils";
import SwissBioVis from "./SwissbioViz";
import membraneCodes from "./membrane-codes";

const sources = [
  {
    id: "HPA_main",
    label: "HPA main location",
  },
  {
    id: "HPA_additional",
    label: "HPA additional location",
  },
  {
    id: "HPA_extracellular_location",
    label: "HPA extracellular location",
  },
  {
    id: "uniprot",
    label: "UniProt",
  },
];

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
  const sortedSls = sls.toSorted((a, b) => {
    // ignore possible [XXXX]: at start when sorting
    const aLocationMain = a.location.replace(/^\[.*\][^a-zA-Z]*/, "");
    const bLocationMain = b.location.replace(/^\[.*\][^a-zA-Z]*/, "");
    return aLocationMain.localeCompare(bLocationMain);
  });
  return (
    <List>
      {sortedSls.map(({ location, termSL }) => {
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

function SubcellularTabPanel({ target, source, sourcesLocations, uniprotId, value, index }) {
  const [hoveredCellPart, setHoveredCellPart] = useState(null);

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`subcellular-tabpanel-${index}`}
      aria-labelledby={`subcellular-tab-${index}`}
      sx={{ display: "flex", gap: 4 }}
    >{value === index && (
        <>
          <SwissBioVis
            taxonId="9606"
            locationIds={sourcesLocations[source.id].map(l => parseLocationTerm(l.termSL)).join()}
            sourceId={source.id.toLowerCase()}
            hoveredCellPart={hoveredCellPart}
            setHoveredCellPart={setHoveredCellPart}
          />
          <Box
            key={source.id}
            sx={{ width: { xs: "55%", sm: "45%" }, flexGrow: 0 }}
          >
            <Typography variant="h6">{source.label}</Typography>
            Location for{" "}
            <LocationLink sourceId={source.id} id={source.id === "uniprot" ? uniprotId : target.id} />
            <LocationsList
              sls={sourcesLocations[source.id]}
              hoveredCellPart={hoveredCellPart}
              setHoveredCellPart={setHoveredCellPart}
            />
          </Box>
        </>
      )}
    </Box>
  );
}

/**
 * A wrapper for the SwissbioViz component
 * @param {*} data the target object as returned by the API
 */
function SubcellularViz({ data: target }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const onTabChange = (event, newTabIndex) => {
    setActiveTabIndex(newTabIndex);
  };

  const uniprotId = getUniprotIds(target.proteinIds)[0];
  const sourcesLocations = parseLocationData(target.subcellularLocations);
  const activeSources = filterSourcesWithData(sources, sourcesLocations);

  return (
    <>
      <Tabs value={activeTabIndex} onChange={onTabChange} aria-label="Subcellular location sources">
        {activeSources.map((source) => (
          <Tab label={source.label} key={source.id} />
        ))}
      </Tabs>

      <Box sx={{ mt: 4 }}>
        {activeSources.map((source, index) => (
          <SubcellularTabPanel
            target={target}
            source={source}
            sourcesLocations={sourcesLocations}
            uniprotId={uniprotId}
            value={activeTabIndex}
            index={index}
            key={source.id}
          />
        ))}
      </Box>
    </>
  );
}

export default SubcellularViz;