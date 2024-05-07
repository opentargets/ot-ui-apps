import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import { Header as HeaderBase, ExternalLink } from "ui";
import { MetadataType } from "./types";

type HeaderProps = {
  loading: boolean;
  metadata: MetadataType;
}

function Header({ loading, metadata }: HeaderProps) {
  const {
    variantId,
    rsIds,
    chromosome,
    position,
    referenceAllele,
    alternateAllele,
  } = metadata;
  const rsId = rsIds[0];
  const gnomadId = `${
    chromosome}-${
    position}-${
    referenceAllele}-${
    alternateAllele}`;

  return (
    <HeaderBase
      loading={loading}
      title={variantId}
      Icon={faMapPin}
      externalLinks={
        <>
          <ExternalLink
            title="Ensembl"
            url={`https://identifiers.org/ensembl:${rsId}`}
            id={rsId}
          />
          <ExternalLink
            title="gnomAD"
            url={`https://gnomad.broadinstitute.org/variant/${gnomadId}?dataset=gnomad_r4`}
            id={gnomadId}
          />
        </>
      }
    />
  );
}

export default Header;