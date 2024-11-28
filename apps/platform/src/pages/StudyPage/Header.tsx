import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import { Header as HeaderBase, ExternalLink, XRefLinks } from "ui";

type HeaderProps = {
  loading: boolean;
  studyId: string;
  backgroundTraits: {
    id: string;
    name: string;
  }[];
  targetId: string;
  diseases: {
    id: string;
    name: string;
  }[];
  studyCategory: string;
};

function Header({
  loading,
  studyId,
  backgroundTraits,
  targetId,
  diseases,
  projectId,
}: HeaderProps) {
  let traitLinks, sourceLink;
  if (projectId === "GCST") {
    if (diseases?.length) {
      traitLinks = (
        <XRefLinks
          label="Trait"
          urlStem="../disease/"
          ids={diseases.map(d => d.id)}
          names={diseases.map(d => d.name)}
        />
      );
    }
    sourceLink = {
      id: "GWAS Catalog",
      url: `https://www.ebi.ac.uk/gwas/studies/${studyId}`,
    };
  } else if (projectId === "FINNGEN_R11") {
    if (diseases?.length) {
      traitLinks = (
        <XRefLinks
          label="Trait"
          urlStem="../disease/"
          ids={diseases.map(d => d.id)}
          names={diseases.map(d => d.name)}
        />
      );
    }
    sourceLink = {
      id: "FinnGen",
      url: `https://r10.finngen.fi/pheno/${studyId}`,
    };
  } else if (projectId === "UKB_PPP_EUR") {
    if (diseases?.length) {
      traitLinks = (
        <XRefLinks
          label="Trait"
          urlStem="../disease/"
          ids={diseases.map(d => d.id)}
          names={diseases.map(d => d.name)}
        />
      );
    }
    sourceLink = {
      id: "UKB",
      url: "https://www.synapse.org/Synapse:syn51364943/wiki/622119",
    };
  } else {
    // QTL
    if (targetId) {
      traitLinks = (
        <ExternalLink title="Affected gene" id={targetId} url={`../target/${targetId}`} />
      );
    }
    sourceLink = {
      id: "eQTL Catalog",
      url: "https://www.ebi.ac.uk/eqtl/Studies/",
    };
  }

  return (
    <HeaderBase
      loading={loading}
      title={studyId}
      subtitle={null}
      Icon={faChartBar}
      externalLinks={
        <>
          {traitLinks}
          {projectId === "GWAS" && backgroundTraits?.length > 0 && (
            <XRefLinks
              label="Background traits"
              urlStem="../disease/"
              ids={backgroundTraits.map(t => t.id)}
              names={backgroundTraits.map(t => t.name)}
            />
          )}
          <ExternalLink title="Source" id={sourceLink.id} url={sourceLink.url} />
        </>
      }
    />
  );
}

export default Header;
