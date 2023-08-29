import { Link } from "ui";

function Description({ symbol, name, rows }) {
  const allProjects =
    rows &&
    rows.OtCrisprSummary &&
    rows.OtCrisprSummary.rows.map((e) => e.projectId);

  const projectsLength = allProjects.length;

  return (
    <>
      Prepublication CRISPR knockout screens from Open Targets (OTAR)
      experimental projects, associating <strong>{symbol}</strong> and{" "}
      <strong>{name}</strong>. Source: Open Targets
      {allProjects.map((e, index) => (
        <Link
          external
          to={`http://home.opentargets.org/ppp-documentation-${e}`}
        >
          {" "}
          Project {e}
          {projectsLength > 1 && index < projectsLength - 1 && ","}
        </Link>
      ))}
    </>
  );
}

export default Description;
