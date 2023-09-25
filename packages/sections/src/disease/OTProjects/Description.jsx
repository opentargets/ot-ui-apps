import { Link } from "ui";

function Description({ name, data }) {
  return (
    <>
      Active and closed projects for <strong>{name}</strong>. Source:{" "}
      {data && (
        <Link
          external
          to={`http://home.opentargets.org/ppp-documentation-${data.disease.otarProjects[0].otarCode}`}
        >
          Open Targets {data.disease.otarProjects[0].otarCode}
        </Link>
      )}
      .
    </>
  );
}

export default Description;
