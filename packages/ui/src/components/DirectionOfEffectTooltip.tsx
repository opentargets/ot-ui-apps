import OTTooltip from "./Tooltip";
import Link from "./Link";
import { ReactElement } from "react";

type DirectionOfEffectTooltipProps = {
  docsUrl: string;
};

function DirectionOfEffectTooltip({ docsUrl }: DirectionOfEffectTooltipProps): ReactElement {
  return (
    <OTTooltip
      showHelpIcon
      title={
        <Link external to={docsUrl} footer={false}>
          More info on our assessment method
        </Link>
      }
      style={{}}
    >
      Direction of Effect
    </OTTooltip>
  );
}

export default DirectionOfEffectTooltip;
