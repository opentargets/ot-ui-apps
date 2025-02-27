import { getConfig } from "@ot/config";

const config = getConfig();

function usePermissions() {
  const { isPartnerPreview } = config.profile;
  return { isPartnerPreview };
}

export default usePermissions;
