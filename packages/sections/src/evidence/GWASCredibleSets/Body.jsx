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
  DisplayVariantId,
} from "ui";
import { variantComparator } from "../../utils/comparators";
import { naLabel, sectionsBaseSizeQuery, credsetConfidenceMap } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import { dataTypesMap } from "../../dataTypes";
import GWAS_CREDIBLE_SETS_QUERY from "./sectionQuery.gql";
import { mantissaExponentComparator } from "../../utils/comparators";

function getColumns(targetSymbol) {
  return [
    {
      id: "credibleSet",
      label: "Navigate",
      renderCell: ({ credibleSet }) => {
        return <Navigate to={`/credible-set/${credibleSet?.studyLocusId}`} />;
      },
      exportValue: ({ credibleSet }) => credibleSet?.studyLocusId,
    },
    {
      id: "variantId",
      label: "Lead Variant",
      sortable: true,
      comparator: variantComparator(d => d?.credibleSet?.variant),
      renderCell: ({ credibleSet }) => {
        const v = credibleSet?.variant;
        if (!v) return naLabel;
        return (
          <Link to={`/variant/${v.id}`}>
            <DisplayVariantId
              variantId={v.id}
              referenceAllele={v.referenceAllele}
              alternateAllele={v.alternateAllele}
              expand={false}
            />
          </Link>
        );
      },
      filterValue: ({ credibleSet: { variant: v } }) =>
        `${v?.chromosome}_${v?.position}_${v?.referenceAllele}_${v?.alternateAllele}`,
      exportValue: ({ credibleSet: { variant: v } }) =>
        `${v?.chromosome}_${v?.position}_${v?.referenceAllele}_${v?.alternateAllele}`,
    },
    {
      id: "trait",
      label: "Reported trait",
      renderCell: ({ credibleSet }) => credibleSet?.study.traitFromSource,
      exportValue: ({ credibleSet }) => credibleSet?.study.traitFromSource,
    },
    {
      id: "disease",
      label: "Disease/phenotype",
      renderCell: ({ disease }) => <Link to={`/disease/${disease.id}`}>{disease.name}</Link>,
      filterValue: ({ disease }) => disease.name,
      exportValue: ({ disease }) => `${disease.name} (${disease.id})`,
    },
    {
      id: "study",
      label: "Study",
      renderCell: ({ credibleSet }) => {
        return <Link to={`/study/${credibleSet?.study.id}`}>{credibleSet?.study.id}</Link>;
      },
      exportValue: ({ credibleSet }) => credibleSet?.study.id,
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
      exportValue: ({ credibleSet }) => credibleSet?.study.nSamples,
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
      id: "credibleSet.beta",
      label: "Beta (CI 95%)",
      numeric: true,
      sortable: true,
      renderCell: ({ credibleSet }) => {
        return credibleSet?.beta ? credibleSet.beta.toFixed(3) : naLabel;
      },
    },
    {
      id: "confidence",
      label: "Fine-mapping confidence",
      sortable: true,
      tooltip:
        "Fine-mapping confidence based on the quality of the linkage-desequilibrium information available and fine-mapping method",
      renderCell: ({ credibleSet }) => {
        if (!credibleSet?.confidence) return naLabel;
        return (
          <Tooltip title={credibleSet?.confidence} style="">
            <ClinvarStars num={credsetConfidenceMap[credibleSet?.confidence]} />
          </Tooltip>
        );
      },
      filterValue: ({ credibleSet }) => credsetConfidenceMap[credibleSet?.confidence],
      exportValue: ({ credibleSet }) => credibleSet?.confidence,
    },
    {
      id: "finemappingMethod",
      label: "Fine-mapping method",
      renderCell: ({ credibleSet }) => credibleSet?.finemappingMethod || naLabel,
      exportValue: ({ credibleSet }) => credibleSet?.finemappingMethod,
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
      renderCell: ({ credibleSet, disease }) => {
        const { publicationFirstAuthor, publicationDate, pubmedId } = credibleSet?.study ?? {};
        if (!publicationFirstAuthor) return naLabel;
        return (
          <PublicationsDrawer
            name={disease.name}
            symbol={targetSymbol}
            entries={[{ name: pubmedId }]}
            customLabel={`${publicationFirstAuthor} et al. (${new Date(
              publicationDate
            ).getFullYear()})`}
          />
        );
      },
      filterValue: ({ literature, publicationYear, publicationFirstAuthor }) =>
        `${literature} ${publicationYear} ${publicationFirstAuthor}`,
      exportValue: ({ credibleSet }) => credibleSet?.study.pubmedId,
    },
  ];
}

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;
  const variables = { ensemblId: ensgId, efoId, size: sectionsBaseSizeQuery };

  const columns = getColumns(label.symbol);

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
