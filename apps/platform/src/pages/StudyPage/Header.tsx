import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import { Header as HeaderBase, ExternalLink, XRefLinks } from "ui";

function Header({ loading, studyId, traitFromSource, backgroundTraits, targetId, diseaseId, studyType }) {

  let traitLink, sourceLink;
  if (studyType === 'GWAS') {
    traitLink = {
      title: "Trait",
      url: `https://platform.opentargets.org/disease/${diseaseId}`, 
    };
    sourceLink = {
      id: "GWAS Catalog",
      url: `https://www.ebi.ac.uk/gwas/studies/${studyId}`,
    };
  } else if (studyType === 'FINNGEN') {
    traitLink = {
      title: "Trait",
      url: `https://platform.opentargets.org/disease/${diseaseId}`,
    };
    sourceLink = {
      id: "FinnGenR10",
      url: `https://r10.finngen.fi/pheno/${studyID}`,
    };
  } else {  // QTL
    traitLink = {
      title: "Affected gene",
      url: `../target/${targetId}`,
    };
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
        <>
          <ExternalLink
            title={traitLink.title}
            id={traitFromSource}
            url={traitLink.url}
          />
          { 
            studyType === "GWAS" && backgroundTraits.length > 0 &&
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