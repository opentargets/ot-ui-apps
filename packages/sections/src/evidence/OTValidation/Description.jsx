import { Link } from "ui";

function Description({ symbol, name }) {
  return (
    <>
      Data generated for targets identified in selected OTAR primary projects
      and have undergone independent prioritisation and orthogonal experimental
      validation in the Open Targets Validation Lab (OTVL), associating{' '}
      <strong>{symbol}</strong> and <strong>{name}</strong>. Source:{' '}
      <Link external to="http://home.opentargets.org/ppp-documentation-otar2059">
        Open Targets Validation Lab
      </Link>
    </>
  );
}

export default Description;
