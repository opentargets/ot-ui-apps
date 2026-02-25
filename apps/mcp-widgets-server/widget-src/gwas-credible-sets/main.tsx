import { mountWidget } from "../shared/createWidgetEntry";
import GWASCredibleSetsWidget from "./GWASCredibleSetsWidget";

mountWidget({
  appName: "ot-gwas-credible-sets-widget",
  cacheKey: "ot-gwas",
  extractArgs: args => {
    const studyId = args?.studyId;
    return typeof studyId === "string" ? { studyId } : null;
  },
  component: GWASCredibleSetsWidget,
});
