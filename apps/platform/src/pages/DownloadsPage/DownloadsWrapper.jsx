import { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import { LoadingBackdrop, BasePage } from "ui";

const DownloadsPage = lazy(() => import("./DownloadsPage"));

function DownloadsWrapper() {
  const location = useLocation();
  return (
    <BasePage
      title="Data downloads | Open Targets Platform"
      description="Data downloads | Open Targets Platform"
      location={location}
    >
      <Suspense fallback={<LoadingBackdrop />}>
        <DownloadsPage />
      </Suspense>
    </BasePage>
  );
}

export default DownloadsWrapper;
