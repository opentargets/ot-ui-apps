import { Suspense, lazy } from "react";
import { BasePage, LoadingBackdrop } from "ui";

const APIPage = lazy(() => import("./APIPage"));

function APIPageWrapper() {
  return (
    <BasePage title="API" description="API">
      <Suspense fallback={<LoadingBackdrop />}>
        <APIPage />
      </Suspense>
    </BasePage>
  );
}

export default APIPageWrapper;
