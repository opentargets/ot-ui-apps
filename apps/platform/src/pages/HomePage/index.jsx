import PublicHome from "./HomePage";
import PPHome from "./PPHomePage";
import { usePermissions } from "ui";

function GetHomePage({ suggestions }) {
  const { isPartnerPreview } = usePermissions();
  if (isPartnerPreview) return <PPHome suggestions={suggestions} />;
  return <PublicHome suggestions={suggestions} />;
}

export default GetHomePage;
