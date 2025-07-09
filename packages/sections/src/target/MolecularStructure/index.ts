wimport { lazy } from "react";
import { TargetData } from "../../types/target";

export const definition = {
  id: "molecularStructure",
  name: "Molecular Structure",
  shortName: "MS",
  hasData: (data: TargetData) => {
    return data?.proteinIds?.some?.(e => e.source === "uniprot_swissprot") || false;
  },
};

// Components
export { default as Summary } from "./Summary";
export const getBodyComponent = () => lazy(() => import("./Body")); 