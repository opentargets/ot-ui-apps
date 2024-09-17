import { useQuery } from "@apollo/client";
import {
  Link,
  SectionItem,
  DataTable,
  ScientificNotation,
  DisplayVariantId
} from "ui";
import { naLabel, defaultRowsPerPageOptions } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import QTL_CREDIBLE_SETS_QUERY from "./QTLCredibleSetsQuery.gql";

const columns = [
  {
    id: "leadVariant",
    label: "Lead Variant",
    renderCell: ({ variant }) => {
      if (!variant) return naLabel;
      const { id: variantId, referenceAllele, alternateAllele } = variant;
      return <Link to={`/variant/${variantId}`}>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
          expand={false}
        />
      </Link>;
    },
    exportValue: ({ variant }) => variant?.id,
  },
  {
    id: "pValue",
    label: "P-Value",
    comparator: (a, b) =>
      a?.pValueMantissa * 10 ** a?.pValueExponent -
        b?.pValueMantissa * 10 ** b?.pValueExponent,
    sortable: true,
    renderCell: ({ pValueMantissa, pValueExponent }) => {
      if (typeof pValueMantissa !== "number" ||
          typeof pValueExponent !== "number") return naLabel;
      return <ScientificNotation number={[pValueMantissa, pValueExponent]} />;
    },
    exportValue: ({ pValueMantissa, pValueExponent }) => {
      if (typeof pValueMantissa !== "number" ||
          typeof pValueExponent !== "number") return null;
      return `${pValueMantissa}x10${pValueExponent}`;
    },
  },
  {
    id: "beta",
    label: "Beta",
    tooltip: "Beta with respect to the ALT allele",
    renderCell: ({ beta }) => {
      if (typeof beta !== "number") return naLabel;
      return beta.toPrecision(3);
    },
  },
  {
    id: "finemappingMethod",
    label: "Finemapping Method",
  },
  {
    id: "credibleSetSize",
    label: "Credible Set Size",
    comparator: (a, b) => a.locus?.length - b.locus?.length,
    sortable: true,
    renderCell: ({ locus }) => locus?.length ?? naLabel,
    exportValue: ({ locus }) => locus?.length,
  }
];

type BodyProps = {
  id: string,
  entity: string,
};

function Body({ id, entity }: BodyProps) {
  const variables = {
    studyId: id,
  };

  const request = useQuery(QTL_CREDIBLE_SETS_QUERY, {
    variables,
  });
  
  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={({ gwasStudy }) => <Description studyId={gwasStudy[0].studyId} />}
      renderBody={({ gwasStudy }) => (
        <DataTable
          dataDownloader
          sortBy="pValue"
          columns={columns}
          rows={gwasStudy[0].credibleSets}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          query={QTL_CREDIBLE_SETS_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );

}

export default Body;