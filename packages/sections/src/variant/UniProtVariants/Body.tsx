// import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { Link, SectionItem, Tooltip, PublicationsDrawer, DataTable } from "ui";
import { definition } from "../../variant/UniProtVariants";
import Description from "../../variant/UniProtVariants/Description";
import { epmcUrl } from "../../utils/urls";
import { identifiersOrgLink } from "../../utils/global";
import { defaultRowsPerPageOptions, sectionsBaseSizeQuery,
} from "../../constants";
// import UNIPROT_VARIANTS_QUERY from "./UniprotVariantsQuery.gql";

function getColumns(label: string) {
  return [
    {
      id: "targetFromSourceId",
      label: "Reported protein",
      renderCell: ({ targetFromSourceId }) => (
        <Link external to={identifiersOrgLink("uniprot", targetFromSourceId)}>
          {targetFromSourceId}
        </Link>
      ),
    },
    {
      id: "disease.name",
      label: "Disease/phenotype",
      renderCell: ({
            "disease.id": disease_id,
            "disease.name": disease_name,
            diseaseFromSource
          }) => (
        <Tooltip
          title={
            <>
              <Typography variant="subtitle2" display="block" align="center">
                Reported disease or phenotype:
              </Typography>
              <Typography variant="caption" display="block" align="center">
                {diseaseFromSource}
              </Typography>
            </>
          }
          showHelpIcon
        >
          <Link to={`/disease/${disease_id}`}>{disease_name}</Link>
        </Tooltip>
      ),
    },
    {
      id: "confidence",
      label: "Confidence",
    },
    {
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
          <PublicationsDrawer entries={literatureList} symbol={label.symbol} name={label.name} />
        );
      },
    },
  ];
}

type BodyProps = {
  id: string,
  label: string,
  entity: string,
};


export function Body({ id, label, entity }) {

  // ID IS JUST THE VARIANT ID STRING FOR NOW
  // const { ensgId, efoId } = id;

  // const variables = {
  //   ensemblId: ensgId,
  //   efoId,
  //   size: sectionsBaseSizeQuery,
  // };

  const columns = getColumns(label);

  // const request = useQuery(UNIPROT_VARIANTS_QUERY, {
  //   variables,
  // });
  const request = mockQuery();

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description variantId={id} />}
      renderBody={({ disease }) => {
        // const { rows } = disease.uniprotVariantsSummary;
        const rows = request.data.variant.uniProtVariants;      
        return (
          <DataTable
            columns={columns}
            rows={rows}
            dataDownloader
            showGlobalFilter
            rowsPerPageOptions={defaultRowsPerPageOptions}
            // query={UNIPROT_VARIANTS_QUERY.loc.source.body}
            // variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;

function mockQuery() {
  return {
    loading: false,
    error: undefined,
    data: JSON.parse(`
{ 
  "variant": {
    "uniProtVariants": [
      {
        "variantId": "15_89327201_C_T",
        "confidence": "high",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 4A",
        "literature": [
          "16639411",
          "15917273",
          "15477547",
          "14635118",
          "15824347",
          "11431686",
          "15122711",
          "26942291",
          "12565911",
          "18828154",
          "14694057",
          "15689359",
          "12707443"
        ],
        "targetFromSourceId": "P54098",
        "target.id": "ENSG00000140521",
        "target.approvedSymbol": "POLG",
        "disease.id": "Orphanet_726",
        "disease.name": "Alpers syndrome"
      },
      {
        "variantId": "15_89327201_C_T",
        "confidence": "high",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 4A",
        "literature": [
          "16639411",
          "15917273",
          "15477547",
          "14635118",
          "15824347",
          "11431686",
          "15122711",
          "26942291",
          "12565911",
          "18828154",
          "14694057",
          "15689359",
          "12707443"
        ],
        "targetFromSourceId": "P54098",
        "target.id": "ENSG00000140521",
        "target.approvedSymbol": "POLG",
        "disease.id": "MONDO_0008758",
        "disease.name": "mitochondrial DNA depletion syndrome 4a"
      },
      {
        "variantId": "15_89327201_C_T",
        "confidence": "high",
        "diseaseFromSource": "Sensory ataxic neuropathy dysarthria and ophthalmoparesis",
        "literature": [
          "16639411",
          "15917273",
          "15477547",
          "14635118",
          "15824347",
          "11431686",
          "15122711",
          "26942291",
          "12565911",
          "18828154",
          "14694057",
          "15689359",
          "12707443"
        ],
        "targetFromSourceId": "P54098",
        "target.id": "ENSG00000140521",
        "target.approvedSymbol": "POLG",
        "disease.id": "MONDO_0011835",
        "disease.name": "sensory ataxic neuropathy, dysarthria, and ophthalmoparesis"
      },
      {
        "variantId": "15_89327201_C_T",
        "confidence": "high",
        "diseaseFromSource": "Spinocerebellar ataxia with epilepsy",
        "literature": [
          "16639411",
          "15917273",
          "15477547",
          "14635118",
          "15824347",
          "11431686",
          "15122711",
          "26942291",
          "12565911",
          "18828154",
          "14694057",
          "15689359",
          "12707443"
        ],
        "targetFromSourceId": "P54098",
        "target.id": "ENSG00000140521",
        "target.approvedSymbol": "POLG",
        "disease.id": "Orphanet_70595",
        "disease.name": "Sensory ataxic neuropathy - dysarthria - ophthalmoparesis"
      },
      {
        "variantId": "15_89327201_C_T",
        "confidence": "high",
        "diseaseFromSource": "Sensory ataxic neuropathy dysarthria and ophthalmoparesis",
        "literature": [
          "16639411",
          "15917273",
          "15477547",
          "14635118",
          "15824347",
          "11431686",
          "15122711",
          "26942291",
          "12565911",
          "18828154",
          "14694057",
          "15689359",
          "12707443"
        ],
        "targetFromSourceId": "P54098",
        "target.id": "ENSG00000140521",
        "target.approvedSymbol": "POLG",
        "disease.id": "Orphanet_70595",
        "disease.name": "Sensory ataxic neuropathy - dysarthria - ophthalmoparesis"
      },
      {
        "variantId": "15_89327201_C_T",
        "confidence": "high",
        "diseaseFromSource": "Spinocerebellar ataxia with epilepsy",
        "literature": [
          "16639411",
          "15917273",
          "15477547",
          "14635118",
          "15824347",
          "11431686",
          "15122711",
          "26942291",
          "12565911",
          "18828154",
          "14694057",
          "15689359",
          "12707443"
        ],
        "targetFromSourceId": "P54098",
        "target.id": "ENSG00000140521",
        "target.approvedSymbol": "POLG",
        "disease.id": "MONDO_0011835",
        "disease.name": "sensory ataxic neuropathy, dysarthria, and ophthalmoparesis"
      }
    ]
  }
}`),
  };
}
