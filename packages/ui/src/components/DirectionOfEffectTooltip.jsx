import OTTooltip from "./Tooltip";
import Link from "./Link";

function DirectionOfEffectTooltip({ docsUrl }) {
  return (
    <OTTooltip
      showHelpIcon
      title={
        <Link external to={docsUrl}>
          More info on our assessment method
        </Link>
      }
    >
      Direction of Effect
    </OTTooltip>
  );
}

export default DirectionOfEffectTooltip;
