import config from '../config';

function usePermissions() {
  return config.profile.isPartnerPreview;
}

export default usePermissions;