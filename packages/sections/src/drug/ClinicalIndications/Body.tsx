import { useQuery } from "@apollo/client";

import localData from "./clinical_indication_CHEMBL2105708.json"  // !! IMPORT LOCAL DATA FOR NOW !!

import { Link, SectionItem, PaginationActionsComplete, TableDrawer, OtTable } from "ui";
import { sourceMap, phaseMap } from "@ot/constants";
import { referenceUrls } from "@ot/utils";

import Description from "./Description";
import RecordsDrawer from "./RecordsDrawer";
import SideBySideTables from "./SideBySideTables";
import CLINICAL_INDICATIONS_QUERY from "./ClinicalIndicationsQuery.gql";
import { definition } from ".";

const columns = [
  {
    id: "diseaseId",
    label: "Indication",
    renderCell: ({ diseaseName, diseaseId }) => (
      <Link asyncTooltip to={`/disease/${diseaseId}`}>
        {diseaseName}
      </Link>
    ),
  },
  {
    id: "maxClinicalStatus",
    label: "Max clinical status",
  },
  {
    id: "mappingConfidence",
    label: "Mapping confidence"
  },
  {
    id: "records",
    label: "Approvals and Trials",
    renderCell: ({ clinicalReportIds }) => (
      <RecordsDrawer recordIds={clinicalReportIds} />
    ),
  },
];

function Body({ id: chemblId, label: name, entity }) {
  const variables = { chemblId };
  const request = useQuery(CLINICAL_INDICATIONS_QUERY, { variables });

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description name={name} />}
      renderBody={() => {
        return (
          <>
            <OtTable
              columns={columns}
              dataDownloader
              dataDownloaderFileStem={`${chemblId}-indications`}
              rows={localData}
              // rows={request.data?.drug.indications.rows}
              showGlobalFilter
              // sortBy="maxPhaseForIndication"
              // order="desc"
              // ActionsComponent={PaginationActionsComplete}
              query={CLINICAL_INDICATIONS_QUERY.loc.source.body}
              variables={variables}
              loading={request.loading}
            />
            <div style={{ height: "50px"}}></div>
            <SideBySideTables
              rows={localData}
              query={CLINICAL_INDICATIONS_QUERY.loc.source.body}
              variables={variables}
              loading={request.loading}
            />
          </>
        );
      }}
    />
  );
}

export default Body;
