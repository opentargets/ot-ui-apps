import PublicHome from './HomePage';
import PPHome from './PPHomePage';

import usePermissions from '../../hooks/usePermissions';

function GetHomePage() {
  if (usePermissions()) return <PPHome />;
  return <PublicHome />;
}

export default GetHomePage;
