import { mountWidget } from "../shared/createWidgetEntry";
import BaselineExpressionWidget from "./BaselineExpressionWidget";

mountWidget({
  appName: "ot-baseline-expression-widget",
  cacheKey: "ot-be",
  extractArgs: args => {
    const ensgId = typeof args.ensgId === "string" ? args.ensgId : null;
    if (!ensgId) return null;
    return { ensgId };
  },
  component: BaselineExpressionWidget,
});
