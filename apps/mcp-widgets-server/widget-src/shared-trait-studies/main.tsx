import { mountWidget } from "../shared/createWidgetEntry";
import SharedTraitStudiesWidget from "./SharedTraitStudiesWidget";

mountWidget({
  appName: "ot-shared-trait-studies-widget",
  cacheKey: "ot-sts",
  extractArgs: args => {
    const studyId = typeof args.studyId === "string" ? args.studyId : null;
    if (!studyId) return null;
    return { studyId };
  },
  component: SharedTraitStudiesWidget,
});
