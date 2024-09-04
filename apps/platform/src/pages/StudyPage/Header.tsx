import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import { Header as HeaderBase, ExternalLink, XRefLinks } from "ui";

type HeaderProps = {
  loading: boolean;
  studyId: string;
  traitFromSource: string;
  backgroundTraits: any[];  // array of diseases - wait until get types directly from schema
  targetId: any;  // target - wait until get types directly from schema
  diseaseId: string;
  studyCategory: string;
};

function Header({ loading,
                  studyId,
                  traitFromSource,
                  backgroundTraits,
                  targetId,
                  diseaseId,
                  studyCategory }: HeaderProps) {

  let traitLink, sourceLink;
  if (studyCategory === 'GWAS') {
    if (diseaseId) {
      traitLink = {
        title: "Trait",
        id: diseaseId,
        url: `../disease/${diseaseId}`, 
      };
    }
    sourceLink = {
      id: "GWAS Catalog",
      url: `https://www.ebi.ac.uk/gwas/studies/${studyId}`,
    };
  } else if (studyCategory === 'FINNGEN') {
    if (diseaseId) {
      traitLink = {
        title: "Trait",
        id: diseaseId,
        url: `../disease/${diseaseId}`,
      };
    }
    sourceLink = {
      id: "FinnGenR10",
      url: `https://r10.finngen.fi/pheno/${studyId}`,
    };
  } else {  // QTL
    if (targetId) {
      traitLink = {
        title: "Affected gene",
        id: targetId,
        url: `../target/${targetId}`,
      };
    }
    sourceLink = {
      id: "eQTL Catalog",
      url: "https://www.ebi.ac.uk/eqtl/Studies/",
    };
  };

  return (
    <HeaderBase
      loading={loading}
      title={studyId}
      subtitle={null}
      Icon={faChartBar}
      externalLinks={
        traitLink &&
          <> 
            <ExternalLink
              title={traitLink.title}
              id={traitFromSource ?? traitLink.id}
              url={traitLink.url}
            />
            { 
              studyCategory === "GWAS" && backgroundTraits?.length > 0 &&
                <XRefLinks
                  label="Background traits"
                  urlStem="../disease/"
                  ids={backgroundTraits.map(t => t.id)}
                  names={backgroundTraits.map(t => t.name)}
                />
            }
            <ExternalLink
              title="Source"
              id={sourceLink.id}
              url={sourceLink.url}
            />
          </>
      }
    />
  );

}

export default Header;