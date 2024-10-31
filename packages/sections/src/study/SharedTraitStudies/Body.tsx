import { Fragment } from "react";
import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import { Link, SectionItem, Tooltip, PublicationsDrawer, OtTable } from "ui";
import { definition } from ".";
import Description from "./Description";
import { naLabel } from "../../constants";
import SHARED_TRAIT_STUDIES_QUERY from "./SharedTraitStudiesQuery.gql";
import { getStudyCategory } from "../../utils/getStudyCategory";
import { epmcUrl } from "ui/src/utils/urls";

function getColumns(diseaseIds: string[]) {
  const diseaseIdsSet = new Set(diseaseIds);
  return [
    {
      id: "studyId",
      label: "Study ID",
      renderCell: ({ studyId }) => <Link to={`./${studyId}`}>{studyId}</Link>,
    },
    {
      id: "sharedDiseases",
      label: "Shared traits",
      renderCell: ({ diseases }) => {
        const sharedTraits = diseases.filter(d => diseaseIdsSet.has(d.id));
        return (
          <>
            {sharedTraits.map(({ id, name }, index) => (
              <Fragment key={id}>
                {index > 0 ? ", " : null}
                <Link to={`../disease/${id}`}>{name}</Link>
              </Fragment>
            ))}
          </>
        );
      },
      exportValue: ({ diseases }) =>
        diseases
          .filter(d => diseaseIdsSet.has(d.id))
          .map(({ name }) => name)
          .join(", "),
    },
    {
      id: "traitFromSource",
      label: "Trait from source",
    },
    {
      id: "author",
      label: "Author",
      renderCell: ({ projectId, publicationFirstAuthor }) =>
        getStudyCategory(projectId) === "FINNGEN" ? "FinnGen" : publicationFirstAuthor || naLabel,
      exportValue: ({ projectId, publicationFirstAuthor }) =>
        getStudyCategory(projectId) === "FINNGEN" ? "FinnGen" : publicationFirstAuthor,
    },
    {
      id: "publicationDate",
      label: "Date",
      renderCell: ({ projectId, publicationDate }) =>
        getStudyCategory(projectId) === "FINNGEN"
          ? "2023"
          : publicationDate
          ? publicationDate.slice(0, 4)
          : naLabel,
      exportValue: ({ projectId, publicationYear }) =>
        getStudyCategory(projectId) === "FINNGEN" ? "2023" : publicationYear,
    },
    {
      id: "publicationJournal",
      label: "Journal",
      renderCell: ({ projectId, publicationJournal }) =>
        getStudyCategory(projectId) === "FINNGEN" ? naLabel : publicationJournal || naLabel,
      exportValue: ({ projectId, publicationJournal }) =>
        getStudyCategory(projectId) === "FINNGEN" ? naLabel : publicationJournal,
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
}

type BodyProps = {
  studyId: string;
  diseaseIds: string[];
  entity: string;
};

const parseStudies = (studyId, gwasStudy) => {
  const studies = [];
  const studyIds = new Set([studyId]);
  for (const study of gwasStudy) {
    if (!studyIds.has(study.studyId)) {
      studies.push(study);
      studyIds.add(study.studyId);
    }
  }
  return studies;
};

export function Body({ studyId, diseaseIds, entity }: BodyProps) {
  const variables = {
    diseaseIds: diseaseIds,
  };

  const request = useQuery(SHARED_TRAIT_STUDIES_QUERY, {
    variables,
  });

  const columns = getColumns(diseaseIds);

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description studyId={studyId} />}
      renderBody={() => {
        const rows = request.data?.gwasStudy ? parseStudies(studyId, request.data.gwasStudy) : [];
        return (
          <OtTable
            columns={columns}
            rows={rows}
            loading={request.loading}
            sortBy="nSamples"
            order="desc"
            dataDownloader
            query={SHARED_TRAIT_STUDIES_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
