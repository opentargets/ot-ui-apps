import { Body as KnownDrugsBody } from "../../common/KnownDrugs";
import Description from "./Description";
import { sentenceCase } from "../../utils/global";

import { definition } from ".";
import KNOWN_DRUGS_BODY_QUERY from "./KnownDrugsQuery.gql";
import client from "../../client";

const exportColumns = id => [
  {
    label: "drugId",
    exportValue: row => row.drug.id,
  },
  {
    label: "drugName",
    exportValue: row => row.drug.name,
  },
  {
    label: "type",
    exportValue: row => row.drugType,
  },
  {
    label: "mechanismOfAction",
    exportValue: row => row.mechanismOfAction,
  },
  {
    label: "actionType",
    exportValue: ({ drug: { mechanismsOfAction } }) => {
      if (!mechanismsOfAction) return "";
      const at = new Set();
      mechanismsOfAction.rows.forEach(row => {
        row.targets.forEach(t => {
          if (t.id === id) {
            at.add(row.actionType);
          }
        });
      });
      const actionTypes = Array.from(at);
      return actionTypes.map(actionType => sentenceCase(actionType));
    },
  },
  {
    label: "diseaseId",
    exportValue: row => row.disease.id,
  },
  {
    label: "diseaseName",
    exportValue: row => row.disease.name,
  },
  {
    label: "phase",
    exportValue: row => row.phase,
  },
  {
    label: "status",
    exportValue: row => row.status,
  },
  {
    label: "source",
    exportValue: row => row.urls.map(reference => reference.url),
  },
];

function Body({ id: ensgId, label: symbol, entity }) {
  return (
    <KnownDrugsBody
      definition={definition}
      entity={entity}
      variables={{ ensgId }}
      BODY_QUERY={KNOWN_DRUGS_BODY_QUERY}
      // eslint-disable-next-line
      Description={() => <Description symbol={symbol} />}
      columnsToShow={["drug", "disease", "clinicalTrials"]}
      stickyColumn="drug"
      exportColumns={exportColumns(ensgId)}
      client={client}
    />
  );
}

export default Body;
