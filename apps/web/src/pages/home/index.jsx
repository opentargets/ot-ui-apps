import { getSuggestedSearch } from "utils/global";
// import PublicHome from "./HomePage";
// import PPHome from "./PPHomePage";
import { usePermissions } from "ui";
import dynamic from "next/dynamic";

const PublicHome = dynamic(() => import("./HomePage"), { ssr: false });
const PPHome = dynamic(() => import("./PPHomePage"), { ssr: false });

function GetHomePage() {
  const suggestions = getSuggestedSearch();
  const { isPartnerPreview } = usePermissions();
  if (isPartnerPreview) return <PPHome suggestions={suggestions} />;
  return <PublicHome suggestions={suggestions} />;
}

export default GetHomePage;
