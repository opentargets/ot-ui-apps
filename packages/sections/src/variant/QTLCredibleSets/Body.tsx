import { Link, SectionItem, DataTable, ScientificNotation } from "ui";
import { Box, Chip } from "@mui/material";
import { naLabel, defaultRowsPerPageOptions } from "../../constants";
import { definition } from ".";
import Description from "./Description";

function getColumns(id: string, label: string) {

  return [
    {
      id: "leadVariant",
      label: "Lead Variant",
      renderCell: ({ variantId }) => (
        variantId === id
          ? <Box display="flex" alignContent="center" gap={0.5}>
              <span>{variantId}</span>
              <Chip label="self" variant="outlined" size="small"/>
            </Box>
          : <Link to={`/variant/${variantId}`}>{variantId}</Link>
      ),
      exportLabel: "Lead Variant",
    },
    {
      id: "study",
      label: "Study",
      renderCell: d => (
        <Link external to="https://www.ebi.ac.uk/eqtl/Studies/">
          {d["study.projectId"]}
        </Link>
      ),
      exportLabel: "Study",
    },
    {
      id: "type",
      label: "Type",
      renderCell: d => d["study.studyType"],
      exportLabel: "Study",
    },
    {
      id: "gene",
      label: "Gene",
      renderCell: d => (
        <Link to={`/target/${d["target.id"]}`}>
          {d["target.approvedSymbol"]}
        </Link>
      ),
      exportLabel: "Gene",
    },
    {
      id: "tissueCell",
      label: "Tissue/Cell",
      renderCell: d => (
        <Link external to={`https://www.ebi.ac.uk/ols4/search?q=${d.tissueFromSourceId}&ontology=uberon`}>
          {d["tissue.label"] || <i>({d["tissue.id"]})</i>}
        </Link>
      ),
      exportLabel: "Tissue/Cell",
    },
    {
      id: "pValue",
      label: "P-Value",
      comparator: (a, b) =>
        a.pValueMantissa * 10 ** a.pValueExponent - b.pValueMantissa * 10 ** b.pValueExponent,
      sortable: true,
      renderCell: d => (
        <ScientificNotation number={[d.pValueMantissa, d.pValueExponent]} />
      ),
      numeric: true,
      exportLabel: "P-Value",
    },
    {
      id: "beta",
      label: "Beta",
      tooltip: "Beta with respect to the ALT allele",
      renderCell: ({ beta }) => beta || beta === 0 ? beta.toPrecision(3) : naLabel,
      numeric: true,
      exportLabel: "Beta",
    },
    {
      id: "fineMappingMethod",
      label: "Finemapping Method",
      renderCell: ({ finemappingMethod }) => finemappingMethod,
      exportLabel: "Finemapping Method",
    },
    {
      id: "credibleSetSize",
      label: "Credible Set Size",
      comparator: (a, b) => a.locus.length - b.locus.length,
      sortable: true,
      renderCell: ({ locus }) => locus.length,
      numeric: true,
      exportLabel: "Credible Set Size",
    }
  ];
}

// !!!! LOAD LOCAL DATA FOR NOW
// const [metadata, setMetadata] =
//   useState<MetadataType | "waiting" | undefined>("waiting");
const request = mockQuery();

type BodyProps = {
  id: string,
  label: string,
  entity: string,
};

// !! FOR NOW, RENAME id AND SET IT MANUALLY BELOW
function Body({ id: doNotUseForNow, label, entity }: BodyProps) {
  
  // !! FOR NOW, SET id (IE THE PAGE VARIANT ID) TO FAKE TAG_VARIANT_ID
  const id = request.data.TAG_VARIANT_ID;

  const columns = getColumns(id, label);
  const rows = request.data.variant.gwasCredibleSets;

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description variantId={id} />}
      renderBody={() => (
        <DataTable
          dataDownloader
          sortBy="pValue"
          columns={columns}
          rows={rows}
          rowsPerPageOptions={defaultRowsPerPageOptions}
        />
      )}
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
  "TAG_VARIANT_ID": "10_100315722_G_A",
  "variant": {
    "gwasCredibleSets": [
      {
        "variantId": "2_8302417_G_A",
        "study.id": "GTEx_brain_putamen_ENST00000668369",
        "study.projectId": "GTEx",
        "study.studyType": "eqtl",
        "pValueMantissa": 2.359,
        "pValueExponent": -8,
        "beta": 0.694055,
        "posteriorProbability": 0.0248072063095605,
        "tissue.id": "UBERON_0001874",
        "tissue.label": "putamen",
        "tissue.organs": [
          "brain"
        ],
        "tissue.anatomicalSystems": [
          "nervous system"
        ],
        "target.approvedSymbol": "LINC00299",
        "target.id": "ENSG00000236790",
        "finemappingMethod": "SuSie",
        "locus": [
          {
            "beta": 0.642905,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.6040572828625,
            "pValueExponent": -8,
            "pValueMantissa": 1.124,
            "posteriorProbability": 0.0711130529884503,
            "standardError": 0.106521,
            "variantId": "2_8300216_T_C"
          },
          {
            "beta": 0.642905,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.6040572828625,
            "pValueExponent": -8,
            "pValueMantissa": 1.124,
            "posteriorProbability": 0.0711130529884503,
            "standardError": 0.106521,
            "variantId": "2_8300315_CACCA_C"
          },
          {
            "beta": 0.642905,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.6040572828625,
            "pValueExponent": -8,
            "pValueMantissa": 1.124,
            "posteriorProbability": 0.0711130529884503,
            "standardError": 0.106521,
            "variantId": "2_8300442_G_A"
          },
          {
            "beta": 0.642905,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.6040572828625,
            "pValueExponent": -8,
            "pValueMantissa": 1.124,
            "posteriorProbability": 0.0711130529884503,
            "standardError": 0.106521,
            "variantId": "2_8300228_C_A"
          },
          {
            "beta": 0.642905,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.6040572828625,
            "pValueExponent": -8,
            "pValueMantissa": 1.124,
            "posteriorProbability": 0.0711130529884503,
            "standardError": 0.106521,
            "variantId": "2_8300184_A_G"
          },
          {
            "beta": 0.642905,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.6040572828625,
            "pValueExponent": -8,
            "pValueMantissa": 1.124,
            "posteriorProbability": 0.0711130529884503,
            "standardError": 0.106521,
            "variantId": "2_8300257_G_A"
          },
          {
            "beta": 0.710524,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.599567286068,
            "pValueExponent": -9,
            "pValueMantissa": 7.823,
            "posteriorProbability": 0.0709443341781754,
            "standardError": 0.116336,
            "variantId": "2_8302118_G_A"
          },
          {
            "beta": 0.710524,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.599567286068,
            "pValueExponent": -9,
            "pValueMantissa": 7.823,
            "posteriorProbability": 0.0709443341781754,
            "standardError": 0.116336,
            "variantId": "2_8303673_G_A"
          },
          {
            "beta": 0.707031,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.3380989257068,
            "pValueExponent": -8,
            "pValueMantissa": 1.013,
            "posteriorProbability": 0.05493800379884,
            "standardError": 0.116746,
            "variantId": "2_8301605_C_G"
          },
          {
            "beta": 0.627503,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.0559753546737,
            "pValueExponent": -8,
            "pValueMantissa": 1.981,
            "posteriorProbability": 0.0416366528677439,
            "standardError": 0.105964,
            "variantId": "2_8301354_T_C"
          },
          {
            "beta": 0.627503,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.0559753546737,
            "pValueExponent": -8,
            "pValueMantissa": 1.981,
            "posteriorProbability": 0.0416366528677439,
            "standardError": 0.105964,
            "variantId": "2_8299775_T_C"
          },
          {
            "beta": 0.627503,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.0559753546737,
            "pValueExponent": -8,
            "pValueMantissa": 1.981,
            "posteriorProbability": 0.0416366528677439,
            "standardError": 0.105964,
            "variantId": "2_8301617_G_C"
          },
          {
            "beta": 0.627503,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.0559753546737,
            "pValueExponent": -8,
            "pValueMantissa": 1.981,
            "posteriorProbability": 0.0416366528677439,
            "standardError": 0.105964,
            "variantId": "2_8301238_AG_A"
          },
          {
            "beta": 0.627503,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.0559753546737,
            "pValueExponent": -8,
            "pValueMantissa": 1.981,
            "posteriorProbability": 0.0416366528677439,
            "standardError": 0.105964,
            "variantId": "2_8301922_G_A"
          },
          {
            "beta": 0.627503,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.0559753546737,
            "pValueExponent": -8,
            "pValueMantissa": 1.981,
            "posteriorProbability": 0.0416366528677439,
            "standardError": 0.105964,
            "variantId": "2_8300902_T_A"
          },
          {
            "beta": 0.617058,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.0362580958606,
            "pValueExponent": -8,
            "pValueMantissa": 1.9,
            "posteriorProbability": 0.0408672957421271,
            "standardError": 0.104052,
            "variantId": "2_8299499_G_A"
          },
          {
            "beta": 0.694055,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 16.5117080110389,
            "pValueExponent": -8,
            "pValueMantissa": 2.359,
            "posteriorProbability": 0.0248072063095605,
            "standardError": 0.117906,
            "variantId": "2_8302417_G_A"
          },
          {
            "beta": 0.62834,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 16.425230102072,
            "pValueExponent": -8,
            "pValueMantissa": 3.6,
            "posteriorProbability": 0.0227548621765494,
            "standardError": 0.108323,
            "variantId": "2_8301854_G_C"
          },
          {
            "beta": 0.614712,
            "is95CredibleSet": false,
            "is99CredibleSet": true,
            "logBF": 16.2116375202122,
            "pValueExponent": -8,
            "pValueMantissa": 4.056,
            "posteriorProbability": 0.0186121956658267,
            "standardError": 0.106421,
            "variantId": "2_8299556_T_A"
          }
        ]
      },
      {
        "variantId": "2_8302417_G_A",
        "study.id": "GTEx_blood_ENST00000668369",
        "study.projectId": "GTEx",
        "study.studyType": "eqtl",
        "pValueMantissa": 1.316,
        "pValueExponent": -13,
        "beta": 0.437502,
        "posteriorProbability": 0.206320522430541,
        "tissue.id": "UBERON_0000178",
        "tissue.label": "blood",
        "tissue.organs": [
          "blood"
        ],
        "tissue.anatomicalSystems": [
          "circulatory system",
          "hemolymphoid system",
          "hematopoietic system"
        ],
        "target.approvedSymbol": "LINC00299",
        "target.id": "ENSG00000236790",
        "finemappingMethod": "SuSie",
        "locus": [
          {
            "beta": 0.441853,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 27.5844258581983,
            "pValueExponent": -14,
            "pValueMantissa": 6.226,
            "posteriorProbability": 0.437585247168172,
            "standardError": 0.0576047,
            "variantId": "2_8303673_G_A"
          },
          {
            "beta": 0.439394,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 27.0953274288198,
            "pValueExponent": -13,
            "pValueMantissa": 1.0,
            "posteriorProbability": 0.268767540614083,
            "standardError": 0.0577853,
            "variantId": "2_8302118_G_A"
          },
          {
            "beta": 0.437502,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 26.8295969712965,
            "pValueExponent": -13,
            "pValueMantissa": 1.316,
            "posteriorProbability": 0.206320522430541,
            "standardError": 0.0578308,
            "variantId": "2_8302417_G_A"
          },
          {
            "beta": 0.427533,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 25.678130696286,
            "pValueExponent": -13,
            "pValueMantissa": 4.28,
            "posteriorProbability": 0.0660264004283134,
            "standardError": 0.0577982,
            "variantId": "2_8301605_C_G"
          }
        ]
      },
      {
        "variantId": "2_8302417_G_A",
        "study.id": "OneK1K_NK_ENSG00000236790",
        "study.projectId": "OneK1K",
        "study.studyType": "eqtl",
        "pValueMantissa": 2.615,
        "pValueExponent": -9,
        "beta": -0.234293,
        "posteriorProbability": 0.00675924439887354,
        "tissue.id": "CL_0000623",
        "target.approvedSymbol": "LINC00299",
        "target.id": "ENSG00000236790",
        "finemappingMethod": "SuSie",
        "locus": [
          {
            "beta": -0.271104,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.2516206510268,
            "pValueExponent": -11,
            "pValueMantissa": 1.723,
            "posteriorProbability": 0.274712436451997,
            "standardError": 0.0398152,
            "variantId": "2_8317950_G_A"
          },
          {
            "beta": -0.271095,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 17.2502726069861,
            "pValueExponent": -11,
            "pValueMantissa": 1.725,
            "posteriorProbability": 0.274342370894736,
            "standardError": 0.0398149,
            "variantId": "2_8319274_C_T"
          },
          {
            "beta": -0.271475,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 16.5946293668575,
            "pValueExponent": -11,
            "pValueMantissa": 3.462,
            "posteriorProbability": 0.14241675323407,
            "standardError": 0.0404998,
            "variantId": "2_8328080_G_T"
          },
          {
            "beta": -0.269839,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 16.207924249784,
            "pValueExponent": -11,
            "pValueMantissa": 6.97,
            "posteriorProbability": 0.0967445137874696,
            "standardError": 0.0409132,
            "variantId": "2_8318470_CAA_C"
          },
          {
            "beta": -0.269839,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 16.207924249784,
            "pValueExponent": -11,
            "pValueMantissa": 6.97,
            "posteriorProbability": 0.0967445137874696,
            "standardError": 0.0409132,
            "variantId": "2_8318470_CAA_C"
          },
          {
            "beta": -0.269839,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 16.207924249784,
            "pValueExponent": -11,
            "pValueMantissa": 6.97,
            "posteriorProbability": 0.0967445137874696,
            "standardError": 0.0409132,
            "variantId": "2_8318470_CAA_C"
          },
          {
            "beta": -0.265941,
            "is95CredibleSet": false,
            "is99CredibleSet": true,
            "logBF": 15.9593114306933,
            "pValueExponent": -10,
            "pValueMantissa": 1.076,
            "posteriorProbability": 0.0754513364335386,
            "standardError": 0.0407396,
            "variantId": "2_8321295_G_C"
          },
          {
            "beta": -0.250459,
            "is95CredibleSet": false,
            "is99CredibleSet": false,
            "logBF": 14.7767588466438,
            "pValueExponent": -10,
            "pValueMantissa": 5.806,
            "posteriorProbability": 0.0231288588741211,
            "standardError": 0.0400143,
            "variantId": "2_8326356_C_G"
          },
          {
            "beta": -0.268473,
            "is95CredibleSet": false,
            "is99CredibleSet": false,
            "logBF": 14.6517634254716,
            "pValueExponent": -10,
            "pValueMantissa": 3.317,
            "posteriorProbability": 0.020413996505835,
            "standardError": 0.0422823,
            "variantId": "2_8330530_G_A"
          },
          {
            "beta": -0.249102,
            "is95CredibleSet": false,
            "is99CredibleSet": false,
            "logBF": 14.2876759204919,
            "pValueExponent": -10,
            "pValueMantissa": 9.779,
            "posteriorProbability": 0.014184311179504,
            "standardError": 0.040346,
            "variantId": "2_8321272_G_A"
          },
          {
            "beta": -0.235415,
            "is95CredibleSet": false,
            "is99CredibleSet": false,
            "logBF": 13.7255582849134,
            "pValueExponent": -9,
            "pValueMantissa": 2.204,
            "posteriorProbability": 0.00808799095217061,
            "standardError": 0.0389802,
            "variantId": "2_8302118_G_A"
          },
          {
            "beta": -0.234261,
            "is95CredibleSet": false,
            "is99CredibleSet": false,
            "logBF": 13.6429102465236,
            "pValueExponent": -9,
            "pValueMantissa": 2.429,
            "posteriorProbability": 0.00744683074699681,
            "standardError": 0.0388939,
            "variantId": "2_8301605_C_G"
          },
          {
            "beta": -0.234293,
            "is95CredibleSet": false,
            "is99CredibleSet": false,
            "logBF": 13.5459654738097,
            "pValueExponent": -9,
            "pValueMantissa": 2.615,
            "posteriorProbability": 0.00675924439887354,
            "standardError": 0.0389794,
            "variantId": "2_8302417_G_A"
          },
          {
            "beta": -0.233958,
            "is95CredibleSet": false,
            "is99CredibleSet": false,
            "logBF": 13.4752592670769,
            "pValueExponent": -9,
            "pValueMantissa": 2.714,
            "posteriorProbability": 0.00629822953336312,
            "standardError": 0.0389641,
            "variantId": "2_8303673_G_A"
          },
          {
            "beta": -0.260677,
            "is95CredibleSet": false,
            "is99CredibleSet": false,
            "logBF": 13.4266225989143,
            "pValueExponent": -9,
            "pValueMantissa": 1.219,
            "posteriorProbability": 0.0060003978172174,
            "standardError": 0.0424708,
            "variantId": "2_8331189_G_A"
          }
        ]
      },
      {
        "variantId": "2_8302417_G_A",
        "study.id": "GTEx_brain_hippocampus_ENST00000668369",
        "study.projectId": "GTEx",
        "study.studyType": "eqtl",
        "pValueMantissa": 1.538,
        "pValueExponent": -12,
        "beta": 0.835806,
        "posteriorProbability": 0.165901511700505,
        "tissue.id": "UBERON_0001954",
        "tissue.label": "hippocampus proper",
        "tissue.organs": [
          "brain"
        ],
        "tissue.anatomicalSystems": [
          "nervous system"
        ],
        "target.approvedSymbol": "LINC00299",
        "target.id": "ENSG00000236790",
        "finemappingMethod": "SuSie",
        "locus": [
          {
            "beta": 0.851218,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 31.9502944290118,
            "pValueExponent": -13,
            "pValueMantissa": 5.857,
            "posteriorProbability": 0.456618152566933,
            "standardError": 0.107896,
            "variantId": "2_8311368_A_G"
          },
          {
            "beta": 0.839676,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 31.0181593663888,
            "pValueExponent": -12,
            "pValueMantissa": 1.414,
            "posteriorProbability": 0.179810930741611,
            "standardError": 0.108583,
            "variantId": "2_8301605_C_G"
          },
          {
            "beta": 0.835806,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 30.9376219772967,
            "pValueExponent": -12,
            "pValueMantissa": 1.538,
            "posteriorProbability": 0.165901511700505,
            "standardError": 0.108293,
            "variantId": "2_8302417_G_A"
          },
          {
            "beta": 0.835806,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 30.9376219772967,
            "pValueExponent": -12,
            "pValueMantissa": 1.538,
            "posteriorProbability": 0.165901511700505,
            "standardError": 0.108293,
            "variantId": "2_8302118_G_A"
          }
        ]
      },
      {
        "variantId": "2_8302417_G_A",
        "study.id": "OneK1K_NK_ENSG00000235665",
        "study.projectId": "OneK1K",
        "study.studyType": "eqtl",
        "pValueMantissa": 5.725,
        "pValueExponent": -9,
        "beta": -0.271797,
        "posteriorProbability": 0.192983930988765,
        "tissue.id": "CL_0000623",
        "target.approvedSymbol": "LINC00298",
        "target.id": "ENSG00000235665",
        "finemappingMethod": "SuSie",
        "locus": [
          {
            "beta": -0.271797,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 15.2241703106444,
            "pValueExponent": -9,
            "pValueMantissa": 5.725,
            "posteriorProbability": 0.192983930988765,
            "standardError": 0.0462429,
            "variantId": "2_8302417_G_A"
          },
          {
            "beta": -0.271833,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 15.2218194819916,
            "pValueExponent": -9,
            "pValueMantissa": 5.737,
            "posteriorProbability": 0.192530791669411,
            "standardError": 0.0462518,
            "variantId": "2_8302118_G_A"
          },
          {
            "beta": -0.271412,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 15.1904424703745,
            "pValueExponent": -9,
            "pValueMantissa": 5.929,
            "posteriorProbability": 0.186583542163576,
            "standardError": 0.0462246,
            "variantId": "2_8303673_G_A"
          },
          {
            "beta": -0.269625,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 15.0247420804285,
            "pValueExponent": -9,
            "pValueMantissa": 7.051,
            "posteriorProbability": 0.158092245682673,
            "standardError": 0.0461546,
            "variantId": "2_8301605_C_G"
          },
          {
            "beta": -0.2654,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 14.3613254794471,
            "pValueExponent": -8,
            "pValueMantissa": 1.409,
            "posteriorProbability": 0.0814314934103171,
            "standardError": 0.0463882,
            "variantId": "2_8298563_C_T"
          },
          {
            "beta": -0.263233,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 14.1213590132954,
            "pValueExponent": -8,
            "pValueMantissa": 1.814,
            "posteriorProbability": 0.0640584295744518,
            "standardError": 0.0463698,
            "variantId": "2_8309993_A_G"
          },
          {
            "beta": -0.25805,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 13.6925538957963,
            "pValueExponent": -8,
            "pValueMantissa": 2.839,
            "posteriorProbability": 0.0417204122512237,
            "standardError": 0.0461046,
            "variantId": "2_8311368_A_G"
          },
          {
            "beta": -0.258396,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 13.0793950855009,
            "pValueExponent": -8,
            "pValueMantissa": 5.392,
            "posteriorProbability": 0.0225973287224273,
            "standardError": 0.0471427,
            "variantId": "2_8311571_T_C"
          },
          {
            "beta": -0.257731,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 12.7361652556066,
            "pValueExponent": -8,
            "pValueMantissa": 7.748,
            "posteriorProbability": 0.0160322428284877,
            "standardError": 0.0475987,
            "variantId": "2_8319274_C_T"
          }
        ]
      },
      {
        "variantId": "2_8302417_G_A",
        "study.id": "GTEx_brain_frontal_cortex_ENST00000668369",
        "study.projectId": "GTEx",
        "study.studyType": "eqtl",
        "pValueMantissa": 1.647,
        "pValueExponent": -11,
        "beta": 0.830331,
        "posteriorProbability": 0.170740875140783,
        "tissue.id": "UBERON_0009834",
        "target.approvedSymbol": "LINC00299",
        "target.id": "ENSG00000236790",
        "finemappingMethod": "SuSie",
        "locus": [
          {
            "beta": 0.791836,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 30.4073796634121,
            "pValueExponent": -11,
            "pValueMantissa": 1.18,
            "posteriorProbability": 0.25605360330664,
            "standardError": 0.10827,
            "variantId": "2_8309993_A_G"
          },
          {
            "beta": 0.835412,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 30.2112029910782,
            "pValueExponent": -11,
            "pValueMantissa": 1.307,
            "posteriorProbability": 0.210577225022572,
            "standardError": 0.114515,
            "variantId": "2_8301605_C_G"
          },
          {
            "beta": 0.830331,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 30.0005251675673,
            "pValueExponent": -11,
            "pValueMantissa": 1.647,
            "posteriorProbability": 0.170740875140783,
            "standardError": 0.11447,
            "variantId": "2_8302417_G_A"
          },
          {
            "beta": 0.830331,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 30.0005251675673,
            "pValueExponent": -11,
            "pValueMantissa": 1.647,
            "posteriorProbability": 0.170740875140783,
            "standardError": 0.11447,
            "variantId": "2_8302118_G_A"
          },
          {
            "beta": 0.815016,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 29.4233646571621,
            "pValueExponent": -11,
            "pValueMantissa": 2.896,
            "posteriorProbability": 0.0962553420059085,
            "standardError": 0.113961,
            "variantId": "2_8303673_G_A"
          },
          {
            "beta": 0.803417,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 29.2260690447822,
            "pValueExponent": -11,
            "pValueMantissa": 4.432,
            "posteriorProbability": 0.0791844579537612,
            "standardError": 0.113566,
            "variantId": "2_8311368_A_G"
          }
        ]
      },
      {
        "variantId": "2_8302417_G_A",
        "study.id": "BrainSeq_brain_ENSG00000236790.7_2_8301809_8302425",
        "study.projectId": "BrainSeq",
        "study.studyType": "eqtl",
        "pValueMantissa": 9.465,
        "pValueExponent": -11,
        "beta": 0.355105,
        "posteriorProbability": 0.182954793751843,
        "tissue.id": "UBERON_0009834",
        "target.approvedSymbol": "LINC00299",
        "target.id": "ENSG00000236790",
        "finemappingMethod": "SuSie",
        "locus": [
          {
            "beta": 0.348512,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 19.7118062384469,
            "pValueExponent": -11,
            "pValueMantissa": 4.363,
            "posteriorProbability": 0.325265824142563,
            "standardError": 0.0516138,
            "variantId": "2_8303673_G_A"
          },
          {
            "beta": 0.350213,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 19.6686661010807,
            "pValueExponent": -11,
            "pValueMantissa": 4.366,
            "posteriorProbability": 0.31155351080831,
            "standardError": 0.0518665,
            "variantId": "2_8301605_C_G"
          },
          {
            "beta": 0.355105,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 19.1351840148282,
            "pValueExponent": -11,
            "pValueMantissa": 9.465,
            "posteriorProbability": 0.182954793751843,
            "standardError": 0.0535762,
            "variantId": "2_8302417_G_A"
          },
          {
            "beta": 0.353183,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 19.1100319671448,
            "pValueExponent": -11,
            "pValueMantissa": 9.795,
            "posteriorProbability": 0.178422962536864,
            "standardError": 0.0533308,
            "variantId": "2_8302118_G_A"
          }
        ]
      },
      {
        "variantId": "2_8302417_G_A",
        "study.id": "GTEx_brain_hypothalamus_ENST00000668369",
        "study.projectId": "GTEx",
        "study.studyType": "eqtl",
        "pValueMantissa": 7.41,
        "pValueExponent": -17,
        "beta": 0.987616,
        "posteriorProbability": 0.203673012020257,
        "tissue.id": "UBERON_0001898",
        "tissue.label": "hypothalamus",
        "tissue.organs": [
          "brain"
        ],
        "tissue.anatomicalSystems": [
          "nervous system"
        ],
        "target.approvedSymbol": "LINC00299",
        "target.id": "ENSG00000236790",
        "finemappingMethod": "SuSie",
        "locus": [
          {
            "beta": 0.987616,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 45.8103660921336,
            "pValueExponent": -17,
            "pValueMantissa": 7.41,
            "posteriorProbability": 0.203673012020257,
            "standardError": 0.105202,
            "variantId": "2_8302118_G_A"
          },
          {
            "beta": 0.987616,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 45.8103660921336,
            "pValueExponent": -17,
            "pValueMantissa": 7.41,
            "posteriorProbability": 0.203673012020257,
            "standardError": 0.105202,
            "variantId": "2_8302417_G_A"
          },
          {
            "beta": 0.965776,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 45.5998083046688,
            "pValueExponent": -17,
            "pValueMantissa": 6.952,
            "posteriorProbability": 0.165190730726159,
            "standardError": 0.10276,
            "variantId": "2_8311368_A_G"
          },
          {
            "beta": 0.944358,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 45.5538932664539,
            "pValueExponent": -17,
            "pValueMantissa": 8.847,
            "posteriorProbability": 0.157825021421304,
            "standardError": 0.100909,
            "variantId": "2_8309993_A_G"
          },
          {
            "beta": 0.986365,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 45.4920936073802,
            "pValueExponent": -17,
            "pValueMantissa": 9.943,
            "posteriorProbability": 0.148399736070221,
            "standardError": 0.105616,
            "variantId": "2_8301605_C_G"
          },
          {
            "beta": 0.978528,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 45.3251774332668,
            "pValueExponent": -16,
            "pValueMantissa": 1.135,
            "posteriorProbability": 0.125729484225722,
            "standardError": 0.105023,
            "variantId": "2_8303673_G_A"
          }
        ]
      },
      {
        "variantId": "2_8302417_G_A",
        "study.id": "GTEx_brain_spinal_cord_ENST00000668369",
        "study.projectId": "GTEx",
        "study.studyType": "eqtl",
        "pValueMantissa": 3.806,
        "pValueExponent": -12,
        "beta": 0.967534,
        "posteriorProbability": 0.453422800407135,
        "tissue.id": "UBERON_0006469",
        "tissue.label": "C1 segment of cervical spinal cord",
        "tissue.organs": [
          "spinal cord"
        ],
        "tissue.anatomicalSystems": [
          "nervous system"
        ],
        "target.approvedSymbol": "LINC00299",
        "target.id": "ENSG00000236790",
        "finemappingMethod": "SuSie",
        "locus": [
          {
            "beta": 0.967534,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 46.7855020162381,
            "pValueExponent": -12,
            "pValueMantissa": 3.806,
            "posteriorProbability": 0.453422800407135,
            "standardError": 0.124168,
            "variantId": "2_8302417_G_A"
          },
          {
            "beta": 0.957207,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 46.57806814963,
            "pValueExponent": -12,
            "pValueMantissa": 5.371,
            "posteriorProbability": 0.368676961424256,
            "standardError": 0.123914,
            "variantId": "2_8311368_A_G"
          },
          {
            "beta": 0.934523,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 44.7538794718291,
            "pValueExponent": -11,
            "pValueMantissa": 2.832,
            "posteriorProbability": 0.0603001320652395,
            "standardError": 0.126338,
            "variantId": "2_8301605_C_G"
          },
          {
            "beta": 0.934523,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 44.7538794718291,
            "pValueExponent": -11,
            "pValueMantissa": 2.832,
            "posteriorProbability": 0.0603001320652395,
            "standardError": 0.126338,
            "variantId": "2_8302118_G_A"
          },
          {
            "beta": 0.934523,
            "is95CredibleSet": true,
            "is99CredibleSet": true,
            "logBF": 44.7538794718291,
            "pValueExponent": -11,
            "pValueMantissa": 2.832,
            "posteriorProbability": 0.0603001320652395,
            "standardError": 0.126338,
            "variantId": "2_8303673_G_A"
          }
        ]
      }
    ]
}
}`),
};
}