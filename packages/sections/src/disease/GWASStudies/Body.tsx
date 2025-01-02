import { Box, Typography } from "@mui/material";
import { Link, SectionItem, Tooltip, PublicationsDrawer, OtTable, useBatchQuery } from "ui";
import Description from "./Description";
import { naLabel, initialResponse, table5HChunkSize } from "../../constants";
import { getStudyCategory } from "../../utils/getStudyCategory";
import GWAS_STUDIES_BODY_QUERY from "./GWASStudiesQuery.gql";
import { definition } from ".";
import { epmcUrl } from "ui/src/utils/urls";
import { ReactElement, useEffect, useState } from "react";
import { responseType } from "ui/src/types/response";

const columns = [
  {
    id: "id",
    label: "Study",
    enableHiding: false,
    renderCell: ({ id }) => <Link to={`/study/${id}`}>{id}</Link>,
  },
  {
    id: "traitFromSource",
    label: "Reported trait",
  },
  {
    id: "publicationFirstAuthor",
    label: "First author",
    renderCell: ({ projectId, publicationFirstAuthor }) =>
      getStudyCategory(projectId) === "FINNGEN" ? "FinnGen" : publicationFirstAuthor || naLabel,
  },
  {
    id: "publicationDate",
    label: "Year",
    renderCell: ({ projectId, publicationDate }) =>
      getStudyCategory(projectId) === "FINNGEN"
        ? "2023"
        : publicationDate
        ? publicationDate.slice(0, 4)
        : naLabel,
    exportValue: ({ projectId, publicationDate }) =>
      getStudyCategory(projectId) === "FINNGEN" ? "2023" : publicationDate?.slice(0, 4),
  },
  {
    id: "publicationJournal",
    label: "Journal",
    renderCell: ({ projectId, publicationJournal }) =>
      getStudyCategory(projectId) === "FINNGEN" ? naLabel : publicationJournal || naLabel,
    exportValue: ({ projectId, publicationJournal }) =>
      getStudyCategory(projectId) === "FINNGEN" ? null : publicationJournal,
  },
  {
    id: "nSamples",
    label: "Sample size",
    comparator: (a, b) => a?.nSamples - b?.nSamples,
    sortable: true,
  },
  {
    id: "cohorts",
    label: "Cohorts",
    renderCell: ({ projectId, cohorts, ldPopulationStructure }) => {
      let displayText;
      if (getStudyCategory(projectId) === "FINNGEN") displayText = "FinnGen";
      else if (cohorts?.length) displayText = cohorts.join(", ");
      else return naLabel;
      return ldPopulationStructure?.length ? (
        <Tooltip
          title={
            <>
              <Typography variant="subtitle2" display="block" align="center">
                LD populations and relative sample sizes
              </Typography>
              {ldPopulationStructure.map(({ ldPopulation, relativeSampleSize }) => (
                <Box key={ldPopulation}>
                  <Typography variant="caption">
                    {ldPopulation}: {relativeSampleSize}
                  </Typography>
                </Box>
              ))}
            </>
          }
          showHelpIcon
        >
          {displayText}
        </Tooltip>
      ) : (
        displayText
      );
    },
    exportValue: ({ projectId, cohorts }) =>
      getStudyCategory(projectId) === "FINNGEN"
        ? "FinnGen"
        : cohorts?.length
        ? cohorts.join(", ")
        : null,
  },
  {
    id: "pubmedId",
    label: "PubMed ID",
    renderCell: ({ projectId, pubmedId }) =>
      getStudyCategory(projectId) === "GWAS" && pubmedId ? (
        <PublicationsDrawer entries={[{ name: pubmedId, url: epmcUrl(pubmedId) }]} />
      ) : (
        naLabel
      ),
    exportValue: ({ projectId, pubmedId }) =>
      getStudyCategory(projectId) === "GWAS" && pubmedId ? pubmedId : null,
  },
];

type BodyProps = {
  id: string;
  label: string;
};

function Body({ id: efoId, label: diseaseName }: BodyProps): ReactElement {
  const variables = {
    diseaseIds: [efoId],
    size: table5HChunkSize,
    index: 0,
  };

  const [request, setRequest] = useState<responseType>(initialResponse);

  const getData = useBatchQuery({
    query: GWAS_STUDIES_BODY_QUERY,
    variables,
    dataPath: "data.studies",
    size: table5HChunkSize,
  });

  useEffect(() => {
    getData().then(r => {
      setRequest(r);
    });
  }, [efoId]);

  return (
    <SectionItem
      definition={definition}
      entity="studies"
      pageEntity="disease"
      showContentLoading
      loadingMessage="Loading data. This may take some time..."
      request={request}
      renderDescription={() => <Description name={diseaseName} />}
      renderBody={() => (
        <OtTable
          columns={columns}
          rows={request.data?.studies.rows}
          sortBy="nSamples"
          order="desc"
          dataDownloader
          loading={request.loading}
          query={GWAS_STUDIES_BODY_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
