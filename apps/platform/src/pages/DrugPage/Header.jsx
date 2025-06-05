import { faPrescriptionBottleAlt } from "@fortawesome/free-solid-svg-icons";
import { Header as HeaderBase, ExternalLink } from "ui";

function DrugHeader({ loading, chemblId, name, crossReferences }) {
  const chemblUrl = `https://www.ebi.ac.uk/chembl/compound_report_card/${chemblId}/`;

  const drugBank = crossReferences ? crossReferences.find(cr => cr.source === "drugbank") : null;
  const chEBI = crossReferences ? crossReferences.find(cr => cr.source === "chEBI") : null;
  const dailyMed = crossReferences ? crossReferences.find(cr => cr.source === "DailyMed") : null;
  const drugCentral = crossReferences
    ? crossReferences.find(cr => cr.source === "DrugCentral")
    : null;
  const wikipedia = crossReferences ? crossReferences.find(cr => cr.source === "Wikipedia") : null;

  return (
    <HeaderBase
      loading={loading}
      title={name}
      subtitle={null}
      Icon={faPrescriptionBottleAlt}
      externalLinks={
        <>
          <ExternalLink title="ChEMBL" id={chemblId} url={chemblUrl} />
          {crossReferences ? (
            <>
              {drugBank && (
                <ExternalLink
                  title="DrugBank"
                  id={drugBank.ids[0]}
                  url={`https://identifiers.org/drugbank:${drugBank.ids[0]}`}
                />
              )}
              {chEBI && (
                <ExternalLink
                  title="ChEBI"
                  id={chEBI.ids[0]}
                  url={`https://identifiers.org/CHEBI:${chEBI.ids[0]}`}
                />
              )}
              {dailyMed && (
                <ExternalLink
                  title="DailyMed"
                  id={decodeURI(dailyMed.ids[0])}
                  url={`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${dailyMed.ids[0]}`}
                />
              )}
              {drugCentral && (
                <ExternalLink
                  title="DrugCentral"
                  id={drugCentral.ids[0]}
                  url={`https://drugcentral.org/drugcard/${drugCentral.ids[0]}`}
                />
              )}
              {wikipedia && (
                <ExternalLink
                  title="Wikipedia"
                  id={wikipedia.ids[0]}
                  url={`https://en.wikipedia.org/wiki/${wikipedia.ids[0]}`}
                />
              )}
            </>
          ) : null}
        </>
      }
    />
  );
}

export default DrugHeader;
