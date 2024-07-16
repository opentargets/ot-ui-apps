import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import { Header as HeaderBase, ExternalLink } from "ui";

function Header({ loading, studyId, traitFromSource, targetId, studyType }) {

  let traitLink, sourceLink;
  if (studyType === 'GWAS') {
    traitLink = {
      title: "Trait",
      url: `https://platform.opentargets.org/disease/???`,  // !!!!! SCHEMA DOES NOT HAVE traitFromSourceMappedIds
    };
    sourceLink = {
      id: "GWAS Catalog",
      url: `https://www.ebi.ac.uk/gwas/studies/${studyId}`,
    };
  } else if (studyType === 'FINNGEN') {
    traitLink = {
      title: "Trait",
      url: `https://platform.opentargets.org/disease/???`,  // !!!!! SCHEMA DOES NOT HAVE traitFromSourceMappedIds
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
            title={traitLink.title}  // TS complains if spread props
            id={traitFromSource}
            url={traitLink.url}
          />
          { // !!!!! Background trait if GWAS:          
            // !!!!! want to check if backgroundTraitFromSourceMappedIds if null
            // !!!!! but this property not in schema - does have backgroundTraits
            // !!!!! which us an array of diseases
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