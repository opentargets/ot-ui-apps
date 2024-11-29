import { useQuery } from "@apollo/client";
import {
  SectionItem,
  Link,
  PublicationsDrawer,
  OtTable,
  ScientificNotation,
  ClinvarStars,
  OtScoreLinearBar,
  Tooltip,
  Navigate,
} from "ui";

import { naLabel, sectionsBaseSizeQuery, credsetConfidenceMap } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import { dataTypesMap } from "../../dataTypes";
import GWAS_CREDIBLE_SETS_QUERY from "./sectionQuery.gql";
import { mantissaExponentComparator } from "../../utils/comparators";

function getColumns() {
  return [
    {
      id: "credibleSet",
      label: "Navigate",
      renderCell: ({ credibleSet }) => {
        return <Navigate to={`/credible-set/${credibleSet?.studyLocusId}`} />;
      },
    },
    {
      id: "variantId",
      label: "Lead Variant",
      renderCell: ({ credibleSet }) => {
        const variantId = credibleSet?.variant?.id;
        if (variantId) return <Link to={`/variant/${variantId}`}>{variantId}</Link>;
        return naLabel;
      },
    },
    {
      id: "trait",
      label: "Reported trait",
      renderCell: ({ credibleSet }) => credibleSet?.study.traitFromSource,
    },
    {
      id: "disease",
      label: "Disease/phenotype",
      renderCell: ({ disease }) => <Link to={`/disease/${disease.id}`}>{disease.name}</Link>,
      filterValue: ({ disease }) => disease.name,
    },
    {
      id: "study",
      label: "Study",
      renderCell: ({ credibleSet }) => {
        return (
          <Link to={`/study/${credibleSet?.study.id}`}>{credibleSet?.study.id}</Link>
        );
      },
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
      filterValue: ({ credibleSet }) => parseInt(credibleSet?.study.nSamples, 10).toLocaleString(),
    },
    {
      id: "pValue",
      label: "P-value",
      comparator: (a, b) => {
        return mantissaExponentComparator(
          a?.credibleSet?.pValueMantissa,
          a?.credibleSet?.pValueExponent,
          b?.credibleSet?.pValueMantissa,
          b?.credibleSet?.pValueExponent
        );
      },
      sortable: true,
      filterValue: false,
      renderCell: ({ credibleSet }) => {
        const { pValueMantissa, pValueExponent } = credibleSet ?? {};
        if (typeof pValueMantissa !== "number" || typeof pValueExponent !== "number")
          return naLabel;
        return <ScientificNotation number={[pValueMantissa, pValueExponent]} />;
      },
      exportValue: ({ credibleSet }) => {
        const { pValueMantissa, pValueExponent } = credibleSet ?? {};
        if (typeof pValueMantissa !== "number" || typeof pValueExponent !== "number") return null;
        return `${pValueMantissa}x10${pValueExponent}`;
      },
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
      id: "confidence",
      label: "Fine-mapping confidence",
      sortable: true,
      tooltip: "Fine-mapping confidence based on the quality of the linkage-desequilibrium information available and fine-mapping method",
      renderCell: ({ credibleSet }) => {
        if (!credibleSet?.confidence) return naLabel;
        return (
          <Tooltip title={credibleSet?.confidence} style="">
            <ClinvarStars num={credsetConfidenceMap[credibleSet?.confidence]} />
          </Tooltip>
        );
      },
      filterValue: ({ credibleSet }) => credsetConfidenceMap[credibleSet?.confidence],
    },
    {
      id: "finemappingMethod",
      label: "Fine-mapping method",
      renderCell: ({ credibleSet }) => credibleSet?.finemappingMethod || naLabel,
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
      sortable: true,
      renderCell: ({ score }) => {
        if (!score) return naLabel;
        return (
          <Tooltip title={score.toFixed(3)} style="">
            <OtScoreLinearBar variant="determinate" value={score * 100} />
          </Tooltip>
        );
      },
    },
    {
      id: "publication",
      label: "Publication",
      renderCell: ({ credibleSet }) => {
        const { publicationFirstAuthor, publicationDate, pubmedId } = credibleSet?.study ?? {};
        if (!publicationFirstAuthor) return naLabel;
        return (
          <PublicationsDrawer
            entries={[{ name: pubmedId }]}
            customLabel={`${publicationFirstAuthor} et al. (${new Date(
              publicationDate
            ).getFullYear()})`}
          />
        );
      },
      filterValue: ({ literature, publicationYear, publicationFirstAuthor }) =>
        `${literature} ${publicationYear} ${publicationFirstAuthor}`,
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
          rows={request.data?.disease.gwasCredibleSets.rows}
          showGlobalFilter
          sortBy="score"
          query={GWAS_CREDIBLE_SETS_QUERY.loc.source.body}
          variables={variables}
          loading={request.loading}
        />
      )}
    />
  );
}

export default Body;
