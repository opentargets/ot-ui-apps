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
      id: "trait",
      label: "Trait",
      renderCell: d => (
        "???"
        // <Link to={`/disease/${d["study.disease.id"]}`}>
        //   {d["study.disease.name"]}
        // </Link>
      ),
      exportLabel: "Trait",
    },
    {
      id: "study",
      label: "Study",
      renderCell: d => (
        // <Link external to={`??????????????????????????/${d["study.id"]}`}>
        //   {d["study.id"]}
        // </Link>
        `${d["study.id"]} (url???)`
      ),
      exportLabel: "Study",
    },
    {
      id: "tissue",
      label: "Tissue",
      renderCell: d => "???",
      exportLabel: "Tissue",
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
      exportLabel: "P-Value",
    },
    {
      id: "beta",
      label: "Beta",
      tooltip: "Beta with respect to the ALT allele",
      renderCell: ({ beta }) => beta || beta === 0 ? beta.toPrecision(3) : naLabel,
      exportLabel: "Beta",
    },
    // // {
    // //   id: "ldr2",
    // //   label: "LD (r2)",
    // //   tooltip: "Linkage disequilibrium with the queried variant",
    // //   renderCell: ({ locus }) => (
    // //     locus.find(obj => obj.variantId === id).r2Overall.toFixed(2)
    // //   ),
    // //   exportLabel: "LD (r2)",
    // // },
    {
      id: "fineMappingMethod",
      label: "Finemapping Method",
      renderCell: ({ finemappingMethod }) => finemappingMethod,
      exportLabel: "Finemapping Method",
    },
    {
      id: "topL2G",
      label: "Top L2G",
      tooltip: "Top gene prioritised by our locus-to-gene model",
      renderCell: d => (
        "???"
        // <Link to={`/target/${d["l2g.target.id"]}`}>
        //   {d["l2g.target.approvedSymbol"]}
        // </Link>
      ),
      exportLabel: "Top L2G",
    },
    {
      id: "l2gScore",
      label: "L2G score",
      comparator: (a, b) => a["l2g.score"] - b["l2g.score"],
      sortable: true,
      renderCell: d => "???",
      // renderCell: d => d["l2g.score"].toFixed(3),
      exportLabel: "L2G score", 
    },
    {
      id: "credibleSetSize",
      label: "Credible Set Size",
      comparator: (a, b) => a.locus.length - b.locus.length,
      sortable: true,
      renderCell: ({ locus }) => locus.length,
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
            "study.studyType": "eqtl",
            "study.projectId": "GTEx",
            "pValueMantissa": 2.359,
            "pValueExponent": -8,
            "beta": 0.694055,
            "posteriorProbability": 0.0248072063095605,
            "tissueFromSourceId": "UBERON_0001874",
            "target.id": "ENSG00000236790",
            "target.approvedSymbol": "LINC00299",
            "finemappingMethod": "SuSie",
            "locus": [
              {
                "variantId": "2_8300216_T_C",
                "posteriorProbability": 0.0711130529884503,
                "pValueMantissa": 1.124,
                "pValueExponent": -8,
                "logBF": 17.6040572828625,
                "beta": 0.642905,
                "standardError": 0.106521,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8300315_CACCA_C",
                "posteriorProbability": 0.0711130529884503,
                "pValueMantissa": 1.124,
                "pValueExponent": -8,
                "logBF": 17.6040572828625,
                "beta": 0.642905,
                "standardError": 0.106521,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8300442_G_A",
                "posteriorProbability": 0.0711130529884503,
                "pValueMantissa": 1.124,
                "pValueExponent": -8,
                "logBF": 17.6040572828625,
                "beta": 0.642905,
                "standardError": 0.106521,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8300228_C_A",
                "posteriorProbability": 0.0711130529884503,
                "pValueMantissa": 1.124,
                "pValueExponent": -8,
                "logBF": 17.6040572828625,
                "beta": 0.642905,
                "standardError": 0.106521,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8300184_A_G",
                "posteriorProbability": 0.0711130529884503,
                "pValueMantissa": 1.124,
                "pValueExponent": -8,
                "logBF": 17.6040572828625,
                "beta": 0.642905,
                "standardError": 0.106521,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8300257_G_A",
                "posteriorProbability": 0.0711130529884503,
                "pValueMantissa": 1.124,
                "pValueExponent": -8,
                "logBF": 17.6040572828625,
                "beta": 0.642905,
                "standardError": 0.106521,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8302118_G_A",
                "posteriorProbability": 0.0709443341781754,
                "pValueMantissa": 7.823,
                "pValueExponent": -9,
                "logBF": 17.599567286068,
                "beta": 0.710524,
                "standardError": 0.116336,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8303673_G_A",
                "posteriorProbability": 0.0709443341781754,
                "pValueMantissa": 7.823,
                "pValueExponent": -9,
                "logBF": 17.599567286068,
                "beta": 0.710524,
                "standardError": 0.116336,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8301605_C_G",
                "posteriorProbability": 0.05493800379884,
                "pValueMantissa": 1.013,
                "pValueExponent": -8,
                "logBF": 17.3380989257068,
                "beta": 0.707031,
                "standardError": 0.116746,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8301354_T_C",
                "posteriorProbability": 0.0416366528677439,
                "pValueMantissa": 1.981,
                "pValueExponent": -8,
                "logBF": 17.0559753546737,
                "beta": 0.627503,
                "standardError": 0.105964,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8299775_T_C",
                "posteriorProbability": 0.0416366528677439,
                "pValueMantissa": 1.981,
                "pValueExponent": -8,
                "logBF": 17.0559753546737,
                "beta": 0.627503,
                "standardError": 0.105964,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8301617_G_C",
                "posteriorProbability": 0.0416366528677439,
                "pValueMantissa": 1.981,
                "pValueExponent": -8,
                "logBF": 17.0559753546737,
                "beta": 0.627503,
                "standardError": 0.105964,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8301238_AG_A",
                "posteriorProbability": 0.0416366528677439,
                "pValueMantissa": 1.981,
                "pValueExponent": -8,
                "logBF": 17.0559753546737,
                "beta": 0.627503,
                "standardError": 0.105964,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8301922_G_A",
                "posteriorProbability": 0.0416366528677439,
                "pValueMantissa": 1.981,
                "pValueExponent": -8,
                "logBF": 17.0559753546737,
                "beta": 0.627503,
                "standardError": 0.105964,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8300902_T_A",
                "posteriorProbability": 0.0416366528677439,
                "pValueMantissa": 1.981,
                "pValueExponent": -8,
                "logBF": 17.0559753546737,
                "beta": 0.627503,
                "standardError": 0.105964,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8299499_G_A",
                "posteriorProbability": 0.0408672957421271,
                "pValueMantissa": 1.9,
                "pValueExponent": -8,
                "logBF": 17.0362580958606,
                "beta": 0.617058,
                "standardError": 0.104052,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8302417_G_A",
                "posteriorProbability": 0.0248072063095605,
                "pValueMantissa": 2.359,
                "pValueExponent": -8,
                "logBF": 16.5117080110389,
                "beta": 0.694055,
                "standardError": 0.117906,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8301854_G_C",
                "posteriorProbability": 0.0227548621765494,
                "pValueMantissa": 3.6,
                "pValueExponent": -8,
                "logBF": 16.425230102072,
                "beta": 0.62834,
                "standardError": 0.108323,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8299556_T_A",
                "posteriorProbability": 0.0186121956658267,
                "pValueMantissa": 4.056,
                "pValueExponent": -8,
                "logBF": 16.2116375202122,
                "beta": 0.614712,
                "standardError": 0.106421,
                "is95CredibleSet": false,
                "is99CredibleSet": true
              }
            ]
          },
          {
            "variantId": "2_8302417_G_A",
            "study.id": "GTEx_blood_ENST00000668369",
            "study.studyType": "eqtl",
            "study.projectId": "GTEx",
            "pValueMantissa": 1.316,
            "pValueExponent": -13,
            "beta": 0.437502,
            "posteriorProbability": 0.206320522430541,
            "tissueFromSourceId": "UBERON_0000178",
            "target.id": "ENSG00000236790",
            "target.approvedSymbol": "LINC00299",
            "finemappingMethod": "SuSie",
            "locus": [
              {
                "variantId": "2_8303673_G_A",
                "posteriorProbability": 0.437585247168172,
                "pValueMantissa": 6.226,
                "pValueExponent": -14,
                "logBF": 27.5844258581983,
                "beta": 0.441853,
                "standardError": 0.0576047,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8302118_G_A",
                "posteriorProbability": 0.268767540614083,
                "pValueMantissa": 1.0,
                "pValueExponent": -13,
                "logBF": 27.0953274288198,
                "beta": 0.439394,
                "standardError": 0.0577853,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8302417_G_A",
                "posteriorProbability": 0.206320522430541,
                "pValueMantissa": 1.316,
                "pValueExponent": -13,
                "logBF": 26.8295969712965,
                "beta": 0.437502,
                "standardError": 0.0578308,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8301605_C_G",
                "posteriorProbability": 0.0660264004283134,
                "pValueMantissa": 4.28,
                "pValueExponent": -13,
                "logBF": 25.678130696286,
                "beta": 0.427533,
                "standardError": 0.0577982,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              }
            ]
          },
          {
            "variantId": "2_8302417_G_A",
            "study.id": "OneK1K_NK_ENSG00000236790",
            "study.studyType": "eqtl",
            "study.projectId": "OneK1K",
            "pValueMantissa": 2.615,
            "pValueExponent": -9,
            "beta": -0.234293,
            "posteriorProbability": 0.00675924439887354,
            "tissueFromSourceId": "CL_0000623",
            "target.id": "ENSG00000236790",
            "target.approvedSymbol": "LINC00299",
            "finemappingMethod": "SuSie",
            "locus": [
              {
                "variantId": "2_8317950_G_A",
                "posteriorProbability": 0.274712436451997,
                "pValueMantissa": 1.723,
                "pValueExponent": -11,
                "logBF": 17.2516206510268,
                "beta": -0.271104,
                "standardError": 0.0398152,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8319274_C_T",
                "posteriorProbability": 0.274342370894736,
                "pValueMantissa": 1.725,
                "pValueExponent": -11,
                "logBF": 17.2502726069861,
                "beta": -0.271095,
                "standardError": 0.0398149,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8328080_G_T",
                "posteriorProbability": 0.14241675323407,
                "pValueMantissa": 3.462,
                "pValueExponent": -11,
                "logBF": 16.5946293668575,
                "beta": -0.271475,
                "standardError": 0.0404998,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8318470_CAA_C",
                "posteriorProbability": 0.0967445137874696,
                "pValueMantissa": 6.97,
                "pValueExponent": -11,
                "logBF": 16.207924249784,
                "beta": -0.269839,
                "standardError": 0.0409132,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8318470_CAA_C",
                "posteriorProbability": 0.0967445137874696,
                "pValueMantissa": 6.97,
                "pValueExponent": -11,
                "logBF": 16.207924249784,
                "beta": -0.269839,
                "standardError": 0.0409132,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8318470_CAA_C",
                "posteriorProbability": 0.0967445137874696,
                "pValueMantissa": 6.97,
                "pValueExponent": -11,
                "logBF": 16.207924249784,
                "beta": -0.269839,
                "standardError": 0.0409132,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8321295_G_C",
                "posteriorProbability": 0.0754513364335386,
                "pValueMantissa": 1.076,
                "pValueExponent": -10,
                "logBF": 15.9593114306933,
                "beta": -0.265941,
                "standardError": 0.0407396,
                "is95CredibleSet": false,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8326356_C_G",
                "posteriorProbability": 0.0231288588741211,
                "pValueMantissa": 5.806,
                "pValueExponent": -10,
                "logBF": 14.7767588466438,
                "beta": -0.250459,
                "standardError": 0.0400143,
                "is95CredibleSet": false,
                "is99CredibleSet": false
              },
              {
                "variantId": "2_8330530_G_A",
                "posteriorProbability": 0.020413996505835,
                "pValueMantissa": 3.317,
                "pValueExponent": -10,
                "logBF": 14.6517634254716,
                "beta": -0.268473,
                "standardError": 0.0422823,
                "is95CredibleSet": false,
                "is99CredibleSet": false
              },
              {
                "variantId": "2_8321272_G_A",
                "posteriorProbability": 0.014184311179504,
                "pValueMantissa": 9.779,
                "pValueExponent": -10,
                "logBF": 14.2876759204919,
                "beta": -0.249102,
                "standardError": 0.040346,
                "is95CredibleSet": false,
                "is99CredibleSet": false
              },
              {
                "variantId": "2_8302118_G_A",
                "posteriorProbability": 0.00808799095217061,
                "pValueMantissa": 2.204,
                "pValueExponent": -9,
                "logBF": 13.7255582849134,
                "beta": -0.235415,
                "standardError": 0.0389802,
                "is95CredibleSet": false,
                "is99CredibleSet": false
              },
              {
                "variantId": "2_8301605_C_G",
                "posteriorProbability": 0.00744683074699681,
                "pValueMantissa": 2.429,
                "pValueExponent": -9,
                "logBF": 13.6429102465236,
                "beta": -0.234261,
                "standardError": 0.0388939,
                "is95CredibleSet": false,
                "is99CredibleSet": false
              },
              {
                "variantId": "2_8302417_G_A",
                "posteriorProbability": 0.00675924439887354,
                "pValueMantissa": 2.615,
                "pValueExponent": -9,
                "logBF": 13.5459654738097,
                "beta": -0.234293,
                "standardError": 0.0389794,
                "is95CredibleSet": false,
                "is99CredibleSet": false
              },
              {
                "variantId": "2_8303673_G_A",
                "posteriorProbability": 0.00629822953336312,
                "pValueMantissa": 2.714,
                "pValueExponent": -9,
                "logBF": 13.4752592670769,
                "beta": -0.233958,
                "standardError": 0.0389641,
                "is95CredibleSet": false,
                "is99CredibleSet": false
              },
              {
                "variantId": "2_8331189_G_A",
                "posteriorProbability": 0.0060003978172174,
                "pValueMantissa": 1.219,
                "pValueExponent": -9,
                "logBF": 13.4266225989143,
                "beta": -0.260677,
                "standardError": 0.0424708,
                "is95CredibleSet": false,
                "is99CredibleSet": false
              }
            ]
          },
          {
            "variantId": "2_8302417_G_A",
            "study.id": "GTEx_brain_hippocampus_ENST00000668369",
            "study.studyType": "eqtl",
            "study.projectId": "GTEx",
            "pValueMantissa": 1.538,
            "pValueExponent": -12,
            "beta": 0.835806,
            "posteriorProbability": 0.165901511700505,
            "tissueFromSourceId": "UBERON_0001954",
            "target.id": "ENSG00000236790",
            "target.approvedSymbol": "LINC00299",
            "finemappingMethod": "SuSie",
            "locus": [
              {
                "variantId": "2_8311368_A_G",
                "posteriorProbability": 0.456618152566933,
                "pValueMantissa": 5.857,
                "pValueExponent": -13,
                "logBF": 31.9502944290118,
                "beta": 0.851218,
                "standardError": 0.107896,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8301605_C_G",
                "posteriorProbability": 0.179810930741611,
                "pValueMantissa": 1.414,
                "pValueExponent": -12,
                "logBF": 31.0181593663888,
                "beta": 0.839676,
                "standardError": 0.108583,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8302417_G_A",
                "posteriorProbability": 0.165901511700505,
                "pValueMantissa": 1.538,
                "pValueExponent": -12,
                "logBF": 30.9376219772967,
                "beta": 0.835806,
                "standardError": 0.108293,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8302118_G_A",
                "posteriorProbability": 0.165901511700505,
                "pValueMantissa": 1.538,
                "pValueExponent": -12,
                "logBF": 30.9376219772967,
                "beta": 0.835806,
                "standardError": 0.108293,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              }
            ]
          },
          {
            "variantId": "2_8302417_G_A",
            "study.id": "OneK1K_NK_ENSG00000235665",
            "study.studyType": "eqtl",
            "study.projectId": "OneK1K",
            "pValueMantissa": 5.725,
            "pValueExponent": -9,
            "beta": -0.271797,
            "posteriorProbability": 0.192983930988765,
            "tissueFromSourceId": "CL_0000623",
            "target.id": "ENSG00000235665",
            "target.approvedSymbol": "LINC00298",
            "finemappingMethod": "SuSie",
            "locus": [
              {
                "variantId": "2_8302417_G_A",
                "posteriorProbability": 0.192983930988765,
                "pValueMantissa": 5.725,
                "pValueExponent": -9,
                "logBF": 15.2241703106444,
                "beta": -0.271797,
                "standardError": 0.0462429,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8302118_G_A",
                "posteriorProbability": 0.192530791669411,
                "pValueMantissa": 5.737,
                "pValueExponent": -9,
                "logBF": 15.2218194819916,
                "beta": -0.271833,
                "standardError": 0.0462518,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8303673_G_A",
                "posteriorProbability": 0.186583542163576,
                "pValueMantissa": 5.929,
                "pValueExponent": -9,
                "logBF": 15.1904424703745,
                "beta": -0.271412,
                "standardError": 0.0462246,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8301605_C_G",
                "posteriorProbability": 0.158092245682673,
                "pValueMantissa": 7.051,
                "pValueExponent": -9,
                "logBF": 15.0247420804285,
                "beta": -0.269625,
                "standardError": 0.0461546,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8298563_C_T",
                "posteriorProbability": 0.0814314934103171,
                "pValueMantissa": 1.409,
                "pValueExponent": -8,
                "logBF": 14.3613254794471,
                "beta": -0.2654,
                "standardError": 0.0463882,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8309993_A_G",
                "posteriorProbability": 0.0640584295744518,
                "pValueMantissa": 1.814,
                "pValueExponent": -8,
                "logBF": 14.1213590132954,
                "beta": -0.263233,
                "standardError": 0.0463698,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8311368_A_G",
                "posteriorProbability": 0.0417204122512237,
                "pValueMantissa": 2.839,
                "pValueExponent": -8,
                "logBF": 13.6925538957963,
                "beta": -0.25805,
                "standardError": 0.0461046,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8311571_T_C",
                "posteriorProbability": 0.0225973287224273,
                "pValueMantissa": 5.392,
                "pValueExponent": -8,
                "logBF": 13.0793950855009,
                "beta": -0.258396,
                "standardError": 0.0471427,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              },
              {
                "variantId": "2_8319274_C_T",
                "posteriorProbability": 0.0160322428284877,
                "pValueMantissa": 7.748,
                "pValueExponent": -8,
                "logBF": 12.7361652556066,
                "beta": -0.257731,
                "standardError": 0.0475987,
                "is95CredibleSet": true,
                "is99CredibleSet": true
              }
            ]
          }
    ]
}
}`),
};
}