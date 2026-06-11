import {
  usePlatformApi,
  ProfileHeader as BaseProfileHeader,
  ProfileChipList,
  Field,
  Tooltip,
} from "ui";
import { useTheme } from "@mui/styles";
import TargetDescription from "./TargetDescription";

import { clearDescriptionCodes, parseSynonyms } from "@ot/utils";

import TARGET_PROFILE_HEADER_FRAGMENT from "./TargetProfileHeader.gql";
import { Box } from "@mui/material";
import { getGenomicLocation } from "@ot/constants";
import GenomicLocation from "ui/src/components/GenomicLocation";

// Target synonym sources, in display order, mapped to their display names.
const TARGET_SYNONYM_SOURCE_LABELS = {
  HGNC: "HGNC",
  uniprot: "UniProt",
  NCBI_entrez: "Entrez",
};
const TARGET_SYNONYM_SORT_ORDER = ["HGNC", "uniprot", "NCBI_entrez"];

function ProfileHeader() {
  const { loading, error, data } = usePlatformApi();

  const theme = useTheme();

  // TODO: Errors!
  if (error) return null;

  const targetDescription = clearDescriptionCodes(
    data?.target.functionDescriptions,
    theme.palette.primary.main
  );
  const synonyms = parseSynonyms(data?.target.synonyms || [], {
    sourceLabels: TARGET_SYNONYM_SOURCE_LABELS,
    sortOrder: TARGET_SYNONYM_SORT_ORDER,
  });

  // geneInfo currently holds the details for the "core essential" chip,
  // however in the future it will hold information to display other chips
  const geneInfo = [
    {
      label: "Core essential gene",
      tooltip: "Source: Cancer DepMap",
      isVisible: data?.target.isEssential,
    },
  ];

  return (
    <BaseProfileHeader>
      <>
        <TargetDescription
          loading={loading}
          descriptions={targetDescription}
          targetId={data?.target.id}
        />
        {data?.target.genomicLocation && (
          <GenomicLocation geneLoc={data?.target.genomicLocation} />
        )}
        {geneInfo
          .filter(gi => gi.isVisible)
          .map(e => (
            <Box
              key={e.label}
              sx={{
                whiteSpace: "nowrap",
                p: "1px 5px",
                color: theme => theme.palette.grey[600],
                border: theme => `1px solid ${theme.palette.grey[600]}`,
                borderRadius: "5px",
                width: "min-content",
                mt: 1,
                typography: "body2",
              }}
            >
              <Tooltip title={e.tooltip}>{e.label}</Tooltip>
            </Box>
          ))}
      </>
      <ProfileChipList title="Synonyms" loading={loading}>
        {synonyms}
      </ProfileChipList>
    </BaseProfileHeader>
  );
}

ProfileHeader.fragments = {
  profileHeader: TARGET_PROFILE_HEADER_FRAGMENT,
};

export default ProfileHeader;
