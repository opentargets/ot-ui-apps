import { mountWidget } from "../shared/createWidgetEntry";
import VariantEffectWidget from "./VariantEffectWidget";

mountWidget({
  appName: "ot-variant-effect-widget",
  cacheKey: "ot-ve",
  extractArgs: args => {
    const variantId = args?.variantId;
    return typeof variantId === "string" ? { variantId } : null;
  },
  component: VariantEffectWidget,
});
