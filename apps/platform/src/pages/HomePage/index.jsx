import PublicHome from './HomePage';
import PPHome from './PPHomePage';
import { usePermissions } from 'ui';

function GetHomePage() {
  const { isPartnerPreview } = usePermissions();
  if (isPartnerPreview) return <PPHome />;
  return <PublicHome />;
}

export default GetHomePage;
