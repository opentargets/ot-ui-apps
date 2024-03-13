import { usePermissions } from "ui";
import dynamic from "next/dynamic";

const PublicHome = dynamic(() => import("./home/HomePage"), { ssr: true });
const PPHome = dynamic(() => import("./home/PPHomePage"), { ssr: true });

function GetHomePage() {
  const { isPartnerPreview } = usePermissions();
  if (isPartnerPreview) return <PPHome />;
  return <PublicHome />;
}

export default GetHomePage;
