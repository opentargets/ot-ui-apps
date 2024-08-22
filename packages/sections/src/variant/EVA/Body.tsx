import { useQuery } from "@apollo/client";
import {
  Link,
  Tooltip,
  SectionItem,
  PublicationsDrawer,
  DataTable,
  ClinvarStars,
} from "ui";
import { Typography } from "@mui/material";
import {
  clinvarStarMap,
  naLabel,
  defaultRowsPerPageOptions,
} from "../../constants";
import { definition } from ".";

import Description from "./Description";
import { epmcUrl } from "../../utils/urls";
import { sentenceCase } from "../../utils/global";
import EVA_QUERY from "./EVAQuery.gql";

const columns = [
  {
    id: "disease.name",
    label: "Disease/phenotype",
    renderCell: ({ disease, diseaseFromSource, cohortPhenotypes }) => {
      return (
        <Tooltip
          title={
            <>
              <Typography variant="subtitle2" display="block" align="center">
                Reported disease or phenotype:
              </Typography>
              <Typography variant="caption" display="block" align="center" gutterBottom>
                {diseaseFromSource}
              </Typography>
              {cohortPhenotypes?.length > 1 ? (
                <>
                  <Typography variant="subtitle2" display="block" align="center">
                    All reported phenotypes:
                  </Typography>
                  <Typography variant="caption" display="block">
                    {cohortPhenotypes.map(cp => (
                      <div key={cp}>{cp}</div>
                    ))}
                  </Typography>
                </>
              ) : (
                ""
              )}
            </>
          }
          showHelpIcon
        >
          <Link to={`/disease/${disease.id}`}>
            {disease.name}
          </Link>
      </Tooltip>
      )
    },
    exportLabel: "Disease/Phenotype",
    exportValue: disease => disease.name,
    filterValue: disease => disease.name,
  },
  {
    id: "studyId",
    label: "ClinVar ID",
    renderCell: ({ studyId }) =>
      studyId ? (
        <Link external to={`https://www.ncbi.nlm.nih.gov/clinvar/${studyId}`}>
          {studyId}
        </Link>
      ) : (
        naLabel
      ),
    exportLabel: "ClinVar ID",
  },
  {
    id: "clinicalSignificances",
    label: "Clinical significance",
    renderCell: ({ clinicalSignificances }) => {
      if (!clinicalSignificances) return naLabel;
      if (clinicalSignificances.length === 1) return sentenceCase(clinicalSignificances[0]);
      if (clinicalSignificances.length > 1)
        return (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {clinicalSignificances.map(clinicalSignificance => (
              <li key={clinicalSignificance}>{sentenceCase(clinicalSignificance)}</li>
            ))}
          </ul>
        );
      return naLabel;
    },
    filterValue: ({ clinicalSignificances }) => clinicalSignificances.join(),
  },
  {
    id: "allelicRequirements",
    label: "Allele origin",
    renderCell: ({ alleleOrigins, allelicRequirements }) => {
      if (!alleleOrigins || alleleOrigins.length === 0) return naLabel;
      if (allelicRequirements)
        return (
          <Tooltip
            title={
              <>
                <Typography variant="subtitle2" display="block" align="center">
                  Allelic requirements:
                </Typography>
                {allelicRequirements.map(r => (
                  <Typography variant="caption" key={r}>
                    {r}
                  </Typography>
                ))}
              </>
            }
            showHelpIcon
          >
            {alleleOrigins.map(a => sentenceCase(a)).join("; ")}
          </Tooltip>
        );
      return alleleOrigins.map(a => sentenceCase(a)).join("; ");
    },
    filterValue: ({ alleleOrigins }) => (alleleOrigins ? alleleOrigins.join() : ""),
  },
  {
    id: "reviewStatus",
    label: "Review status",
    renderCell: ({ confidence }) => (
      <Tooltip title={confidence}>
        <span>
          <ClinvarStars num={clinvarStarMap[confidence]} />
        </span>
      </Tooltip>
    ),
  },
  {
    id: "literature",
    label: "Literature",
    renderCell: ({ literature }) => {
      const literatureList =
        literature?.reduce((acc, id) => {
          if (id !== "NA") {
            acc.push({
              name: id,
              url: epmcUrl(id),
              group: "literature",
            });
          }
          return acc;
        }, []) || [];
      return (
        <PublicationsDrawer entries={literatureList} />
      );
    },
  },
];

type BodyProps = {
  id: string,
  label: string,
  entity: string,
};

function Body({ id, entity }: BodyProps) {
  const variables = {
    variantId: id,
  };

  const request = useQuery(EVA_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={({ variant }) => (
        <Description
          variantId={variant.variantId}
          referenceAllele={variant.referenceAllele}
          alternateAllele={variant.alternateAllele}
        />
      )}
      renderBody={({ variant }) => (
        <DataTable
          dataDownloader
          columns={columns}
          rows={variant.evidences.rows}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          query={EVA_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );

}

export default Body;