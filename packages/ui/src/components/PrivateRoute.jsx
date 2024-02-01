import { Redirect } from "react-router-dom";
import usePermissions from "../hooks/usePermissions";

function PrivateRoute({ children }) {
  const { isPartnerPreview } = usePermissions();

  if (!isPartnerPreview) {
    return <Redirect to="/404" />;
  }

  return children;
}

export default PrivateRoute;
