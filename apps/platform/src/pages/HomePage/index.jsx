import PublicHome from './HomePage';
import PPHome from './PPHomePage';

import config from '../../config';

function GetHomePage() {
  if (config.profile.isPartnerPreview) return <PPHome />;
  return <PublicHome />;
}

export default GetHomePage;
