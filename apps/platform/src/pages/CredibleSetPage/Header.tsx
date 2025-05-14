import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import { DisplayVariantId, ExternalLink, Header as HeaderBase } from "ui";

type HeaderProps = {
  loading: boolean;
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
  studyId: string;
};

function Header({ loading, variantId, referenceAllele, alternateAllele, studyId }: HeaderProps) {
  return (
    <HeaderBase
      loading={loading}
      title="Credible set"
      Icon={faDiagramProject}
      externalLinks={
        <>
          <ExternalLink
            title="Lead variant"
            id={
              variantId && (
                <DisplayVariantId
                  variantId={variantId}
                  referenceAllele={referenceAllele}
                  alternateAllele={alternateAllele}
                  expand={false}
                />
              )
            }
            url={`../variant/${variantId}`}
          />
          <ExternalLink title="Study ID" id={studyId} url={`../study/${studyId}`} />
        </>
      }
    />
  );
}

export default Header;
