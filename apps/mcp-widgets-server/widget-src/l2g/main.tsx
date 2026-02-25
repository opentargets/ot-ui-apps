import { mountWidget } from "../shared/createWidgetEntry";
import L2GWidget from "./L2GWidget";

mountWidget({
  appName: "ot-l2g-widget",
  cacheKey: "ot-l2g",
  extractArgs: args => {
    const studyLocusId = args?.studyLocusId;
    return typeof studyLocusId === "string" ? { studyLocusId } : null;
  },
  component: L2GWidget,
});
