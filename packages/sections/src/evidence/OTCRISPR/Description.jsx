import { Link } from "ui";

function Description({ symbol, name }) {
  return (
    <>
      Prepublication CRISPR knockout screens from Open Targets (OTAR)
      experimental projects, associating <strong>{symbol}</strong> and{' '}
      <strong>{name}</strong>. Source:{' '}
      <Link external to="http://home.opentargets.org/">
        Open Targets
      </Link>
    </>
  );
}

export default Description;
