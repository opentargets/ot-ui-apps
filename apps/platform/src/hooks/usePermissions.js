import config from '../config';

function usePermissions() {
  const isPartnerPreview = config.profile.isPartnerPreview;
  return { isPartnerPreview };
}

export default usePermissions;
