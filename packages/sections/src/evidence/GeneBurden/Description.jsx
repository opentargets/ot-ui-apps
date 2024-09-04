import { Link } from "ui";

function Description({ symbol, diseaseName, data }) {
  // construct direct link to AZ PhwWAS Portal if any row is from there
  const { releaseVersion, targetFromSourceId } =
    data?.disease?.geneBurdenSummary?.rows?.find(row => {
      return row.projectId === "AstraZeneca PheWAS Portal";
    }) ?? {};
  const azLink =
    releaseVersion && targetFromSourceId
      ? `https://azphewas.com/geneView/${releaseVersion}/${targetFromSourceId}`
      : "https://azphewas.com";

  return (
    <>
      Gene burden analysis prioritising <strong>{symbol}</strong> as likely causal gene for{" "}
      <strong>{diseaseName}</strong>. Source:{" "}
      <Link external to={azLink}>
        AstraZeneca PheWAS Portal
      </Link>
      ,{" "}
      <Link external to="https://app.genebass.org">
        Genebass
      </Link>
      ,{" "}
      <Link external to="https://www.finngen.fi/en">
        FinnGen
      </Link>
      .
    </>
  );
}

export default Description;
