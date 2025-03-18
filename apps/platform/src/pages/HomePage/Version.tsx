import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { Link, useAPIMetadata } from "ui";

interface VersionData {
  month: number;
  year: number;
}

function getVersion({ month, year }: VersionData): string {
  return `${year}.${month}`;
}

function getFullMonth({ month, year }: VersionData): string {
  const date = new Date(year + 2000, month - 1);
  return date.toLocaleString("default", { month: "long" });
}

interface VersionContainerProps {
  children: ReactNode;
}

function VersionContainer({ children }: VersionContainerProps): JSX.Element {
  return (
    <Box display="flex" mt={5} justifyContent="center" alignContent="center">
      {children}
    </Box>
  );
}

interface VersionLinkProps {
  month: string;
  year: number;
  version: string;
  link: string;
}

function VersionLink({ month, year, version, link }: VersionLinkProps): JSX.Element {
  return (
    <Link external to={link}>
      {month} 20{year} ({version})
    </Link>
  );
}

interface VersionProps {
  releaseNotesURL?: string;
}

function Version({
  releaseNotesURL = "https://platform-docs.opentargets.org/release-notes",
}: VersionProps): JSX.Element | null {
  const { version } = useAPIMetadata();

  if (version.error) return null;

  if (version.loading)
    return (
      <VersionContainer>
        <Typography variant="body2">Loading data version ...</Typography>
      </VersionContainer>
    );

  // Use non-null assertion since we know these exist when not loading or error
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
