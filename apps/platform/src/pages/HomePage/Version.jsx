import { gql, useQuery } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { Link } from 'ui';

// HELPERS
function getVersion({ month, year }) {
  return `${year}.${month}`;
}

function getFullMonth({ month, year }) {
  const date = new Date(year + 2000, month - 1);
  return date.toLocaleString('default', { month: 'long' });
}

// QUERY
const DATA_VERSION_QUERY = gql`
  query DataVersion {
    meta {
      dataVersion {
        month
        year
      }
    }
  }
`;

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
function Version({
  releaseNotesURL = 'https://platform-docs.opentargets.org/release-notes',
}) {
  const { data, loading, error } = useQuery(DATA_VERSION_QUERY);
  if (error) return null;
  if (loading)
    return (
      <VersionContainer>
        <Typography variant="body2">Loading data version ...</Typography>
      </VersionContainer>
    );
  const {
    meta: {
      dataVersion: { month, year },
    },
  } = data;
  const version = getVersion({ month, year });
  const fullMonth = getFullMonth({ month, year });

  return (
    <VersionContainer>
      <Typography variant="body2">
        Last update:{'  '}
        <VersionLink
          link={releaseNotesURL}
          month={fullMonth}
          year={year}
          version={version}
        />
      </Typography>
    </VersionContainer>
  );
}

export default Version;
