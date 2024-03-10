import { Box, Typography } from "@mui/material";
import { Link, useConfigContext } from "ui";

// HELPERS
function getVersion({ month, year }) {
  return `${year}.${month}`;
}

function getFullMonth({ month, year }) {
  const date = new Date(year + 2000, month - 1);
  return date.toLocaleString("default", { month: "long" });
}

// CONTAINER
function VersionContainer({ children }) {
  return (
    <Box display="flex" mt={5} justifyContent="center" alignContent="center">
      {children}
    </Box>
  );
}

// LINK
function VersionLink({ month, year, version, link }) {
  return (
    <Link external to={link}>
      {month} 20{year} ({version})
    </Link>
  );
}

// MAIN COMPONENT
function Version({ releaseNotesURL = "https://platform-docs.opentargets.org/release-notes" }) {
  const { version } = useConfigContext();
  if (version.error) return null;
  if (version.loading)
    return (
      <VersionContainer>
        <Typography variant="body2">Loading data version ...</Typography>
      </VersionContainer>
    );
  const { month, year } = version;

  const parsedVersion = getVersion({ month, year });
  const fullMonth = getFullMonth({ month, year });

  return (
    <VersionContainer>
      <Typography variant="body2">
        Last update:{" "}
        <VersionLink link={releaseNotesURL} month={fullMonth} year={year} version={parsedVersion} />
      </Typography>
    </VersionContainer>
  );
}

export default Version;
