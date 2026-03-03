import Body from "@ot/sections/variant/VariantEffect/Body";

export default function VariantEffectWidget({ variantId }: { variantId: string }) {
  return <Body id={variantId} entity="variant" />;
}
