import config from "../config";

function usePermissions() {
  const { isPartnerPreview } = config.profile;
  return { isPartnerPreview };
}

export default usePermissions;
