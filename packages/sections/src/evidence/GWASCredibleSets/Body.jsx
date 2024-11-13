import { useQuery } from "@apollo/client";
import { Tooltip } from "@mui/material";
import {
  SectionItem,
  Link,
  PublicationsDrawer,
  OtTable,
  ScientificNotation,
  ClinvarStars,
} from "ui";

import { naLabel, sectionsBaseSizeQuery, clinvarStarMap } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import { dataTypesMap } from "../../dataTypes";
import GWAS_CREDIBLE_SETS_QUERY from "./sectionQuery.gql";

function getColumns() {
  return [
    {
      id: "disease",
      label: "Disease/phenotype",
      renderCell: ({ disease }) => <Link to={`/disease/${disease.id}`}>{disease.name}</Link>,
      filterValue: ({ disease }) => disease.name,
    },
    {
      id: "credibleSet",
      label: "Credible Set",
      renderCell: ({ credibleSet }) => {
        return <Link to={`../credible-set/${credibleSet?.studyLocusId}`}>view</Link>;
      },
    },
    {
      id: "trait",
      label: "Trait",
      renderCell: ({ credibleSet }) => credibleSet?.study.traitFromSource,
    },
    {
      id: "study",
      label: "Study",
      renderCell: ({ credibleSet }) => {
        return (
          <Link to={`../study/${credibleSet?.study.studyId}`}>{credibleSet?.study.studyId}</Link>
        );
      },
    },
    {
      id: "projectId",
      label: "Project",
      renderCell: ({ credibleSet }) => credibleSet?.study.projectId,
    },
    {
      id: "publication",
      label: "Publication",
      renderCell: ({ credibleSet }) => {
        const { publicationFirstAuthor, publicationDate, pubmedId } = credibleSet?.study;
        if (!publicationFirstAuthor) return naLabel;
        return (
          <PublicationsDrawer
            entries={[{ name: pubmedId }]}
            customLabel={`${publicationFirstAuthor} et al, ${publicationDate}`}
          />
        );
      },
      filterValue: ({ literature, publicationYear, publicationFirstAuthor }) =>
        `${literature} ${publicationYear} ${publicationFirstAuthor}`,
    },
    {
      id: "nSamples",
      label: "Sample size",
      numeric: true,
      sortable: true,
      renderCell: ({ credibleSet }) =>
        credibleSet?.study.nSamples
          ? parseInt(credibleSet?.study.nSamples, 10).toLocaleString()
          : naLabel,
    },
    {
      id: "variantId",
      label: "Lead Variant",
      renderCell: ({ credibleSet }) => {
        const { variant } = credibleSet;
        if (variant?.id) return <Link to={`../variant/${variant?.id}`}>{variant?.id}</Link>;
        return naLabel;
      },
    },
    {
      id: "pValueMantissa",
      label: (
        <>
          Association <i>p</i>-value
        </>
      ),
      numeric: true,
      sortable: true,
      renderCell: ({ credibleSet }) => {
        const { pValueMantissa, pValueExponent } = credibleSet;
        return <ScientificNotation number={[pValueMantissa, pValueExponent]} />;
      },
      comparator: (a, b) =>
        a.pValueMantissa * 10 ** a.pValueExponent - b.pValueMantissa * 10 ** b.pValueExponent,
    },
    {
      id: "betaConfidenceInterval",
      label: "Beta (CI 95%)",
      numeric: true,
      renderCell: ({ credibleSet }) => {
        return credibleSet?.beta ? `${parseFloat(credibleSet?.beta.toFixed(3))}` : naLabel;
      },
    },
    {
      id: "finemappingMethod",
      label: "Fine-mapping method",
      renderCell: ({ credibleSet }) => credibleSet?.finemappingMethod || naLabel,
    },
    {
      id: "confidence",
      label: "Confidence",
      sortable: true,
      renderCell: ({ credibleSet }) => {
        if (!credibleSet?.confidence) return naLabel;
        return (
          <Tooltip title={credibleSet?.confidence} style="">
            <ClinvarStars num={clinvarStarMap[credibleSet?.confidence]} />
          </Tooltip>
        );
      },
      filterValue: ({ credibleSet }) => clinvarStarMap[credibleSet?.confidence],
    },
    {
      id: "score",
      label: "L2G score",
      tooltip: (
        <>
          Causal inference score - see{" "}
          <Link
            external
            to="https://platform-docs.opentargets.org/evidence#open-targets-genetics-portal"
          >
            our documentation
          </Link>{" "}
          for more information.
        </>
      ),
      numeric: true,
      sortable: true,
      renderCell: ({ score }) => parseFloat(score?.toFixed(5)),
    },
  ];
}

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;
  const variables = { ensemblId: ensgId, efoId, size: sectionsBaseSizeQuery };

  const columns = getColumns();

  const request = useQuery(GWAS_CREDIBLE_SETS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.genetic_association}
      request={request}
      entity={entity}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={() => (
        <OtTable
          columns={columns}
          dataDownloader
          dataDownloaderFileStem={`otgenetics-${ensgId}-${efoId}`}
          order="desc"
          rows={request.data?.disease.openTargetsGenetics.rows}
          showGlobalFilter
          sortBy="pValueMantissa"
          query={GWAS_CREDIBLE_SETS_QUERY.loc.source.body}
          variables={variables}
          loading={request.loading}
        />
      )}
    />
  );
}

export default Body;
