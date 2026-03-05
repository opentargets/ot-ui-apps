import { useQuery } from "@apollo/client";
import {
  SectionItem,
  useClinicalReportsMasterDetail,
  RecordsCards,
  ClinicalReportsMasterDetailFrame,
} from "ui";
import { useCallback } from "react";
import Description from "./Description";
import DRUGS_QUERY from "./DrugsQuery.gql";
import { definition } from ".";
import DrugsTable from "./DrugsTable";

function Body({ id: ensemblId, label: name, entity }) {
  const variables = { ensemblId };
  const request = useQuery(DRUGS_QUERY, { variables });

  const getClinicalReportsIds = useCallback(
    (row) => row?.clinicalReports?.map((report) => report.id),
    []
  );

  const getMaxClinicalStage = useCallback((row) => row?.maxClinicalStage, []);

  const {
    selectedRow,
    selectRow,
    recordsByStage,
    maxClinicalStage,
    loadingRecords,
  } = useClinicalReportsMasterDetail({
    getClinicalReportsIds,
    getMaxClinicalStage,
  });

  const rows = request.data?.target?.drugAndClinicalCandidates?.rows;

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description name={name} />}
      renderBody={() => {
        return (
          <ClinicalReportsMasterDetailFrame
            master={
              rows?.length > 0 && (
                <DrugsTable
                  ensemblId={ensemblId}
                  rows={rows}
                  selectedRow={selectedRow}
                  selectRow={selectRow}
                  loading={request.loading}
                />
              )
            }
            detail={
              recordsByStage && (
                <RecordsCards
                  records={recordsByStage}
                  loading={loadingRecords}
                  maxClinicalStage={maxClinicalStage}
                />
              )
            }
          />
        );
      }}
    />
  );
}

export default Body;
