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

function Body({ id: efoId, label: name, entity }: any) {
  const variables = { efoId };
  const request = useQuery(DRUGS_QUERY, { variables });
  const AnySectionItem = SectionItem as any;

  const getClinicalReportsIds = useCallback(
    (row: any) => row?.clinicalReports?.map((report: any) => report.id),
    []
  );

  const getMaxClinicalStage = useCallback((row: any) => row?.maxClinicalStage, []);

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

  const rows = request.data?.disease?.drugAndClinicalCandidates?.rows;

  return (
    <AnySectionItem
      definition={definition}
      request={request as any}
      entity={entity}
      renderDescription={() => <Description name={name} />}
      renderBody={() => {
        return (
          <ClinicalReportsMasterDetailFrame
            master={
              rows?.length > 0 && (
                <DrugsTable
                  efoId={efoId}
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
