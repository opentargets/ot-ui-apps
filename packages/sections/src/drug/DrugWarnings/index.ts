import { lazy } from "react";

export const definition = {
  id: "drugWarnings",
  name: "Drug Warnings",
  shortName: "DW",
  hasData: ({ hasBeenWithdrawn, blackBoxWarning }: { hasBeenWithdrawn?: boolean; blackBoxWarning?: boolean }) => hasBeenWithdrawn || blackBoxWarning,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body")); 