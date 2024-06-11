import { Link, SectionItem, DataTable, ScientificNotation } from "ui";
import { Box, Chip } from "@mui/material";
import { naLabel, defaultRowsPerPageOptions } from "../../constants";
import { definition } from ".";
import Description from "./Description";
// import { sentenceCase } from "../../utils/global";

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
        <Link to={`/disease/${d["study.disease.id"]}`}>
          {d["study.disease.name"]}
        </Link>
      ),
      exportLabel: "Trait",
    },
    {
      id: "study",
      label: "Study",
      renderCell: d => (
        <Link external to={`https://www.ebi.ac.uk/gwas/studies/${d["study.id"]}`}>
          {d["study.id"]}
        </Link>
      ),
      exportLabel: "Study",
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
    {
      id: "ldr2",
      label: "LD (r2)",
      tooltip: "Linkage disequilibrium with the queried variant",
      renderCell: ({ locus }) => (
        locus.find(obj => obj.variantId === id).r2Overall.toFixed(2)
      ),
      exportLabel: "LD (r2)",
    },
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
        <Link to={`/target/${d["l2g.target.id"]}`}>
          {d["l2g.target.approvedSymbol"]}
        </Link>
      ),
      exportLabel: "Top L2G",
    },
    {
      id: "l2gScore",
      label: "L2G score",
      comparator: (a, b) => b - a,
      sortable: true,
      renderCell: d => d["l2g.score"].toFixed(3),
      exportLabel: "L2G score", 
    },
    {
      id: "credibleSetSize",
      label: "Credible Set Size",
      renderCell: ({ locus }) => locus.length,
      exportLabel: "Credible Set Size",
    }
  ];
}

// !!!! LOAD LOCAL DATA FOR NOW
// const [metadata, setMetadata] =
//   useState<MetadataType | "waiting" | undefined>("waiting");
const datasetIndex = 1;
const request = mockQuery(datasetIndex);

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

function mockQuery(datasetIndex = 0) {
  
  // !! HARDCODE DATA FOR NOW - ADD TAG_VARIANT_ID FIELD SO CAN TEST WITH
  //    TAG VARIANT NOT EQUAL TO LEAD VARIANT
const datasets = [
`{ 
  "TAG_VARIANT_ID": "10_100315722_G_A",
  "variant": {
    "gwasCredibleSets": [
      {
        "variantId": "10_100315722_G_A",
        "study.id": "GCST001217",
        "study.traitFromSource": "Metabolic traits",
        "study.disease.id": "EFO_0004725",
        "study.disease.name": "Metabolic traits",
        "pValueMantissa": 3.0,
        "pValueExponent": -57,
        "beta": 0.124,
        "ldPopulationStructure": [
          {
            "ldPopulation": "nfe",
            "relativeSampleSize": 1.0
          }
        ],
        "finemappingMethod": "pics",
        "l2g.score": 0.3651695549488067,
        "l2g.target.id": "ENSG00000107593",
        "l2g.target.approvedSymbol": "PKD2L1",
        "locus": [
          {
            "variantId": "10_100315722_G_A",
            "r2Overall": 1.0000000000000049,
            "posteriorProbability": 1.0,
            "standardError": 0.9999989208874888,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          }
        ]
      },
      {
        "variantId": "10_100315722_G_A",
        "study.id": "GCST90060210",
        "study.traitFromSource": "Cholesteryl ester_16:1_[M+NH4]1+ levels",
        "study.disease.id": "EFO_0010342",
        "study.disease.name": "Cholesteryl ester_16:1_[M+NH4]1+ levels",
        "pValueMantissa": 2.0,
        "pValueExponent": -16,
        "beta": -0.110613,
        "ldPopulationStructure": [
          {
            "ldPopulation": "nfe",
            "relativeSampleSize": 1.0
          }
        ],
        "finemappingMethod": "pics",
        "l2g.score": 0.3651695549488067,
        "l2g.target.id": "ENSG00000107593",
        "l2g.target.approvedSymbol": "PKD2L1",
        "locus": [
          {
            "variantId": "10_100315722_G_A",
            "r2Overall": 1.0000000000000049,
            "posteriorProbability": 1.0,
            "standardError": 0.9999994312907632,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          }
        ]
      },
      {
        "variantId": "10_100315722_G_A",
        "study.id": "GCST90296246",
        "study.traitFromSource": "Eicosanoid 13-oxoODE b levels",
        "study.disease.id": "EFO_0020044",
        "study.disease.name": "Eicosanoid 13-oxoODE b levels",
        "pValueMantissa": 5.0,
        "pValueExponent": -72,
        "beta": -0.33,
        "ldPopulationStructure": [
          {
            "ldPopulation": "afr",
            "relativeSampleSize": 0.22721865334285035
          },
          {
            "ldPopulation": "nfe",
            "relativeSampleSize": 0.7727813466571497
          }
        ],
        "finemappingMethod": "pics",
        "l2g.score": 0.3651695549488067,
        "l2g.target.id": "ENSG00000107593",
        "l2g.target.approvedSymbol": "PKD2L1",
        "locus": [
          {
            "variantId": "10_100315722_G_A",
            "r2Overall": 1.0000000000000044,
            "posteriorProbability": 1.0,
            "standardError": 0.9999988411067244,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          }
        ]
      }
    ]
  }
}`,
`{ 
  "TAG_VARIANT_ID": "10_102401718_A_C",
  "variant": {
    "gwasCredibleSets": [
      {
        "variantId": "10_102301461_C_T",
        "study.id": "GCST90002388",
        "study.traitFromSource": "Lymphocyte count",
        "study.disease.id": "EFO_0004587",
        "study.disease.name": "Lymphocyte count",
        "pValueMantissa": 9.0,
        "pValueExponent": -10,
        "beta": -0.035822343,
        "ldPopulationStructure": [
          {
            "ldPopulation": "nfe",
            "relativeSampleSize": 1.0
          }
        ],
        "finemappingMethod": "pics",
        "l2g.score": 0.8546193838119507,
        "l2g.target.id": "ENSG00000107862",
        "l2g.target.approvedSymbol": "GBF1",
        "locus": [
          {
            "variantId": "10_102301461_C_T",
            "r2Overall": 0.9999999999999952,
            "posteriorProbability": 0.6436103112869235,
            "standardError": 0.9999995776567226,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "10_102401718_A_C",
            "r2Overall": 0.967529693453545,
            "posteriorProbability": 0.3458126574756425,
            "standardError": 0.3341021352432721,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "10_102201256_A_T",
            "r2Overall": 0.6144582894378737,
            "posteriorProbability": 0.005827691046010856,
            "standardError": 0.046108147079335846,
            "is95CredibleSet": false,
            "is99CredibleSet": true
          }
        ]
      }
    ]
  }
}`
  ];

  return {
    loading: false,
    error: undefined,
    data: JSON.parse(datasets[datasetIndex])
  };
}


