import PublicHome from './HomePage';
import PPHome from './PPHomePage';

import usePermissions from '../../hooks/usePermissions';

function GetHomePage() {
  const { isPartnerPreview } = usePermissions();
  if (isPartnerPreview) return <PPHome />;
  return <PublicHome />;
}

export default GetHomePage;
