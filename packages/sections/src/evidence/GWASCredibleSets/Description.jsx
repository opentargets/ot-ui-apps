import { Link } from "ui";
import config from "../../config";

function Description({ symbol, name }) {
  return (
    <>
      Genome-wide associated loci prioritisating <strong>{symbol}</strong> as likely causal gene for{" "}
      <strong>{name}</strong>. Source:{" "}
      <Link to={config.geneticsPortalUrl} external>
        Open Targets Genetics
      </Link>
    </>
  );
}

export default Description;
