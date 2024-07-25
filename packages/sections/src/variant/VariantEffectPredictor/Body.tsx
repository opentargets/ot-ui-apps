import { useQuery } from "@apollo/client";
import { Link, SectionItem, DataTable } from "ui";
import { Fragment } from "react";
import { definition } from "../VariantEffectPredictor";
import Description from "../VariantEffectPredictor/Description";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";
import { identifiersOrgLink } from "../../utils/global";
import VARIANT_EFFECT_PREDICTOR_QUERY from "./VariantEffectPredictorQuery.gql";

function formatVariantConsequenceLabel(label) {
  return label.replace(/_/g, ' ');
}

const columns = [
  {
    id: "transcriptId",
    label: "Transcript",
    tooltip: "Ensembl canonical transcript",
  },
  {
    id: "variantConsequences.label",
    label: "Predicted consequence",
    renderCell: ({ variantConsequences }) => (
      variantConsequences.length
        ? variantConsequences.map(({ id, label }, i, arr) => (
            <Fragment key={id}>
              <Link external to={identifiersOrgLink("SO", id.slice(3))}>
                {formatVariantConsequenceLabel(label)}
              </Link>
              {i < arr.length - 1 && ", "}
            </Fragment>
          ))
        : naLabel
    ),
    exportValue: ({ variantConsequences }) => {
      return variantConsequences.map(({ label }) => {
        return formatVariantConsequenceLabel(label)
      }).join(", ")
    }
  },
  {
    id: 'impact',
    label: 'Impact',
    renderCell: ({ impact }) => impact?.toLowerCase?.() ?? naLabel,
    // ?? !! need exportValue here?
    //   - need export label in above cols where may simply be missing?

  },
  { // !!!!! UPDATE ONCE ON API !!!!! 
    id: "consequenceScore",
    label: "Consequence Score",
    renderCell: () => "Not in API"
  },
  {
    id: "target.approvedName",
    label: "Gene",
    renderCell: ({ target }) => (
      <Link to={`../target/${target.id}`}>{target.approvedName}</Link>
    ),
  },
  {
    id: 'aminoAcidChange',
    label: 'Amino acid change',
    renderCell: ({ aminoAcidChange }) => aminoAcidChange ?? naLabel,
  },
  {
    id: 'codons',
    label: 'Coding change',
    renderCell: ({ codons }) => codons ?? naLabel,
  },
  {
    id: "distance",
    label: "Distance from footprint",
    renderCell: ({ distance }) => distance ?? 0,  // CAN REMOVE WHEN API UPDATED SO DIST NEVER NULL
  },
  {
    id: "distanceFromTss",
    label: "Distance from start site",
    renderCell: () => "Not in API",  // FIX WHEN ADDED TO API
  },
  {
    id: "lofteePrediction",
    label: "Loftee prediction",
    renderCell: ({ lofteePrediction }) => lofteePrediction ?? naLabel,
  },
  {
    id: "siftPrediction",
    label: "Sift prediction",
    renderCell: ({ siftPrediction }) => siftPrediction ?? naLabel,
  },
  {
    id: "polyphenPrediction",
    label: "Polyphen prediction",
    renderCell: ({ polyphenPrediction }) => polyphenPrediction ?? naLabel,
  },
  {
    id: "uniprotAccession",
    label: "Uniprot accession",
    renderCell: ({ uniprotAccessions }) => (
      uniprotAccessions?.length
        ? uniprotAccessions.map((id, i, arr) => (
            <Fragment key={id}>
              <Link external to={`https://identifiers.org/uniprot:${id}`}>
                {id}
              </Link>
              { 
                i < arr.length - 1 && ', '
              }
            </Fragment>
          ))
        : naLabel
    )
  }
];

type BodyProps = {
  id: string,
  entity: string,
};

export function Body({ id, entity }: BodyProps) {

  const variables = {
    variantId: id,
  };

  const request = useQuery(VARIANT_EFFECT_PREDICTOR_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description variantId={id} />}
      renderBody={({ variant }) => {
        return (
          <DataTable
            columns={columns}
            rows={variant.transcriptConsequences}
            dataDownloader
            rowsPerPageOptions={defaultRowsPerPageOptions}
            query={VARIANT_EFFECT_PREDICTOR_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;