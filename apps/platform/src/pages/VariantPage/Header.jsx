import { faMapPin } from "@fortawesome/free-solid-svg-icons";

import { Header as HeaderBase, ExternalLink } from "ui";

function Header({
    loading,
    varId,
    rsIds,
    chromosomeB37,
    positionB37,
    referenceAllele,
    alternateAllele,
  }) {
  const rsId = rsIds[0];
  const gnomadId = `${
    chromosomeB37}-${
    positionB37}-${
    referenceAllele}-${
    alternateAllele}`;

  return (
    <HeaderBase
      loading={loading}
      title={varId}
      Icon={faMapPin}
      externalLinks={
        <>
          <ExternalLink
            title="Ensembl"
            url={`https://identifiers.org/ensembl:${rsId}`}
            id={rsId}
          />
          <ExternalLink
            title="gnomAD 2.1"
            url={`https://gnomad.broadinstitute.org/variant/${gnomadId}?dataset=gnomad_r2_1`}
            id={gnomadId}
          />
        </>
      }
    />
  );
}

export default Header;