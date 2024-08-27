import { useQuery } from "@apollo/client";
import { Link, SectionItem, DataTable, ScientificNotation } from "ui";
import { Box, Chip } from "@mui/material";
import { naLabel, defaultRowsPerPageOptions } from "../../constants";
import { definition } from ".";
import Description from "./Description";

function getColumns(id: string) {

  return [
    {
      id: "leadVariant",
      label: "Lead Variant",
      renderCell: ({ variant }) => {
        if (!variant) {
          return naLabel;
        }
        const { variantId } = variant;
        if (variantId === id) {
          return (
            <Box display="flex" alignContent="center" gap={0.5}>
              <span>{variantId}</span>
              <Chip label="self" variant="outlined" size="small"/>
            </Box>
          );
        }
        return <Link to={`/variant/${variantId}`}>{variantId}</Link>
      },
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
    // {
    //   id: "ldr2",
    //   label: "LD (r2)",
    //   tooltip: "Linkage disequilibrium with the queried variant",
    //   renderCell: ({ locus }) => (
    //     locus.find(obj => obj.variantId === id).r2Overall.toFixed(2)
    //   ),
    //   exportLabel: "LD (r2)",
    // },
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
      comparator: (a, b) => a["l2g.score"] - b["l2g.score"],
      sortable: true,
      renderCell: d => d["l2g.score"].toFixed(3),
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
  entity: string,
};

// !! FOR NOW, RENAME id AND SET IT MANUALLY BELOW
function Body({ id, entity }: BodyProps) {
  
  const columns = getColumns(id);
  const rows = request.data.variant.credibleSets;

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
        "variantId": "2_11594935_C_A",
        "study.id": "FINNGEN_R10_N14_ENDOMETRIOSIS_OVARY",
        "study.traitFromSource": "Endometriosis of ovary",
        "study.disease.id": "EFO_1000418",
        "study.disease.traitFromSource": "Endometriosis of ovary",
        "pValueMantissa": 2.164,
        "pValueExponent": -14,
        "beta": -0.145978,
        "posteriorProbability": 0.111228299502257,
        "ldPopulationStructure": [
          {
            "ldPopulation": "fin",
            "relativeSampleSize": 1.0
          }
        ],
        "finemappingMethod": "SuSie",
        "l2g.score": 0.9417305588722228,
        "l2g.target.id": "ENSG00000196208",
        "l2g.target.approvedSymbol": "GREB1",
        "locus": [
          {
            "variantId": "2_11593419_A_AACTC",
            "posteriorProbability": 0.177326488791841,
            "logBF": 27.5495298288152,
            "pValueMantissa": 1.319,
            "pValueExponent": -14,
            "beta": -0.146968,
            "standardError": 0.0190768,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11593362_G_T",
            "posteriorProbability": 0.176010722376543,
            "logBF": 27.5420821417015,
            "pValueMantissa": 1.326,
            "pValueExponent": -14,
            "beta": -0.146956,
            "standardError": 0.019077,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11592421_G_GAATCAC",
            "posteriorProbability": 0.130911954682145,
            "logBF": 27.2460622215016,
            "pValueMantissa": 1.791,
            "pValueExponent": -14,
            "beta": -0.146099,
            "standardError": 0.0190611,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11588262_T_C",
            "posteriorProbability": 0.13027211244461,
            "logBF": 27.2411626613978,
            "pValueMantissa": 1.788,
            "pValueExponent": -14,
            "beta": -0.145821,
            "standardError": 0.0190242,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587963_C_T",
            "posteriorProbability": 0.129091027085527,
            "logBF": 27.2320550177644,
            "pValueMantissa": 1.801,
            "pValueExponent": -14,
            "beta": -0.14579,
            "standardError": 0.0190224,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587954_G_A",
            "posteriorProbability": 0.128198289878656,
            "logBF": 27.2251154308426,
            "pValueMantissa": 1.817,
            "pValueExponent": -14,
            "beta": -0.145762,
            "standardError": 0.0190217,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594935_C_A",
            "posteriorProbability": 0.111228299502257,
            "logBF": 27.0831220672907,
            "pValueMantissa": 2.164,
            "pValueExponent": -14,
            "beta": -0.145978,
            "standardError": 0.0191058,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          }
        ]
      },
      {
        "variantId": "2_11594935_C_A",
        "study.id": "FINNGEN_R10_N14_OTHNONINFUTER",
        "study.traitFromSource": "Other noninflammatory disorders of uterus, except cervix",
        "study.disease.id": "MONDO_0002654",
        "study.disease.traitFromSource": "Other noninflammatory disorders of uterus, except cervix",
        "pValueMantissa": 1.26,
        "pValueExponent": -9,
        "beta": -0.10118,
        "posteriorProbability": 0.0646240799797483,
        "ldPopulationStructure": [
          {
            "ldPopulation": "fin",
            "relativeSampleSize": 1.0
          }
        ],
        "finemappingMethod": "SuSie",
        "l2g.score": 0.877708911895752,
        "l2g.target.id": "ENSG00000196208",
        "l2g.target.approvedSymbol": "GREB1",
        "locus": [
          {
            "variantId": "2_11583732_G_A",
            "posteriorProbability": 0.123874897400711,
            "logBF": 16.9354491631014,
            "pValueMantissa": 6.594,
            "pValueExponent": -10,
            "beta": -0.102154,
            "standardError": 0.0165417,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11582984_G_A",
            "posteriorProbability": 0.104208303192892,
            "logBF": 16.7625688099972,
            "pValueMantissa": 7.91,
            "pValueExponent": -10,
            "beta": -0.101712,
            "standardError": 0.0165474,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584454_G_T",
            "posteriorProbability": 0.103616217105774,
            "logBF": 16.7568708520451,
            "pValueMantissa": 7.976,
            "pValueExponent": -10,
            "beta": -0.10159,
            "standardError": 0.016531,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587963_C_T",
            "posteriorProbability": 0.101382972506177,
            "logBF": 16.7350821517542,
            "pValueMantissa": 7.887,
            "pValueExponent": -10,
            "beta": -0.102021,
            "standardError": 0.0165963,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587954_G_A",
            "posteriorProbability": 0.100033212473414,
            "logBF": 16.7216792542811,
            "pValueMantissa": 7.997,
            "pValueExponent": -10,
            "beta": -0.101981,
            "standardError": 0.0165958,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11588262_T_C",
            "posteriorProbability": 0.098433376267059,
            "logBF": 16.7055569349524,
            "pValueMantissa": 8.132,
            "pValueExponent": -10,
            "beta": -0.101949,
            "standardError": 0.0165978,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11592421_G_GAATCAC",
            "posteriorProbability": 0.0806260576774133,
            "logBF": 16.5059988922095,
            "pValueMantissa": 1.004,
            "pValueExponent": -9,
            "beta": -0.101586,
            "standardError": 0.0166293,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11593419_A_AACTC",
            "posteriorProbability": 0.072037612772621,
            "logBF": 16.3933653809327,
            "pValueMantissa": 1.128,
            "pValueExponent": -9,
            "beta": -0.101354,
            "standardError": 0.0166421,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11593362_G_T",
            "posteriorProbability": 0.0717864382037803,
            "logBF": 16.3898725739579,
            "pValueMantissa": 1.132,
            "pValueExponent": -9,
            "beta": -0.101344,
            "standardError": 0.0166421,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594935_C_A",
            "posteriorProbability": 0.0646240799797483,
            "logBF": 16.2847640951372,
            "pValueMantissa": 1.26,
            "pValueExponent": -9,
            "beta": -0.10118,
            "standardError": 0.0166623,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11585115_G_A",
            "posteriorProbability": 0.0522970712402089,
            "logBF": 16.0731173689718,
            "pValueMantissa": 1.633,
            "pValueExponent": -9,
            "beta": -0.0997497,
            "standardError": 0.0165406,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          }
        ]
      },
      {
        "variantId": "2_11594935_C_A",
        "study.id": "FINNGEN_R10_N14_ENDOMETRIOSIS_DEEP",
        "study.traitFromSource": "Deep endometriosis",
        "study.disease.id": "EFO_0001065",
        "study.disease.traitFromSource": "Deep endometriosis",
        "pValueMantissa": 3.09,
        "pValueExponent": -13,
        "beta": -0.194547,
        "posteriorProbability": 0.192679582087133,
        "ldPopulationStructure": [
          {
            "ldPopulation": "fin",
            "relativeSampleSize": 1.0
          }
        ],
        "finemappingMethod": "SuSie",
        "l2g.score": 0.9246734380722046,
        "l2g.target.id": "ENSG00000196208",
        "l2g.target.approvedSymbol": "GREB1",
        "locus": [
          {
            "variantId": "2_11594935_C_A",
            "posteriorProbability": 0.192679582087133,
            "logBF": 23.2810244386144,
            "pValueMantissa": 3.09,
            "pValueExponent": -13,
            "beta": -0.194547,
            "standardError": 0.0266854,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11593419_A_AACTC",
            "posteriorProbability": 0.0894204712473743,
            "logBF": 22.513345466639,
            "pValueMantissa": 6.808,
            "pValueExponent": -13,
            "beta": -0.191354,
            "standardError": 0.026639,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11592421_G_GAATCAC",
            "posteriorProbability": 0.0878966747817931,
            "logBF": 22.4961578002195,
            "pValueMantissa": 6.842,
            "pValueExponent": -13,
            "beta": -0.191185,
            "standardError": 0.0266179,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11593362_G_T",
            "posteriorProbability": 0.0878367985233052,
            "logBF": 22.4954763562159,
            "pValueMantissa": 6.939,
            "pValueExponent": -13,
            "beta": -0.191285,
            "standardError": 0.026639,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11588262_T_C",
            "posteriorProbability": 0.0779502392676064,
            "logBF": 22.3760664908027,
            "pValueMantissa": 7.709,
            "pValueExponent": -13,
            "beta": -0.190361,
            "standardError": 0.0265637,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587954_G_A",
            "posteriorProbability": 0.0774926306363911,
            "logBF": 22.370178669078,
            "pValueMantissa": 7.754,
            "pValueExponent": -13,
            "beta": -0.190316,
            "standardError": 0.0265603,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587963_C_T",
            "posteriorProbability": 0.0768791505375317,
            "logBF": 22.3622305412039,
            "pValueMantissa": 7.82,
            "pValueExponent": -13,
            "beta": -0.190291,
            "standardError": 0.0265611,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11581409_T_G",
            "posteriorProbability": 0.0685780742815617,
            "logBF": 22.2479686925592,
            "pValueMantissa": 1.972,
            "pValueExponent": -12,
            "beta": -0.185412,
            "standardError": 0.0263503,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11585115_G_A",
            "posteriorProbability": 0.0465175249703967,
            "logBF": 21.8598249484779,
            "pValueMantissa": 4.316,
            "pValueExponent": -12,
            "beta": -0.183247,
            "standardError": 0.0264562,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11583732_G_A",
            "posteriorProbability": 0.0433506043212946,
            "logBF": 21.7893164694463,
            "pValueMantissa": 4.539,
            "pValueExponent": -12,
            "beta": -0.182998,
            "standardError": 0.0264476,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11582984_G_A",
            "posteriorProbability": 0.0283803256702863,
            "logBF": 21.3656919728135,
            "pValueMantissa": 7.176,
            "pValueExponent": -12,
            "beta": -0.181343,
            "standardError": 0.0264576,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584454_G_T",
            "posteriorProbability": 0.0264305054626867,
            "logBF": 21.2945146788173,
            "pValueMantissa": 7.7,
            "pValueExponent": -12,
            "beta": -0.18092,
            "standardError": 0.0264348,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11585053_G_GA",
            "posteriorProbability": 0.00907895051735062,
            "logBF": 20.2259544299461,
            "pValueMantissa": 2.465,
            "pValueExponent": -11,
            "beta": -0.176521,
            "standardError": 0.0264433,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11578465_C_T",
            "posteriorProbability": 0.00767848475087483,
            "logBF": 20.0584180554332,
            "pValueMantissa": 2.018,
            "pValueExponent": -11,
            "beta": 0.177029,
            "standardError": 0.0264038,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584558_A_G",
            "posteriorProbability": 0.00643486002428558,
            "logBF": 19.8817259143663,
            "pValueMantissa": 1.498,
            "pValueExponent": -11,
            "beta": -0.171297,
            "standardError": 0.0253845,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584349_A_G",
            "posteriorProbability": 0.00495008552802085,
            "logBF": 19.619400680622,
            "pValueMantissa": 1.988,
            "pValueExponent": -11,
            "beta": -0.170425,
            "standardError": 0.0254103,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594189_T_C",
            "posteriorProbability": 0.00461446304263031,
            "logBF": 19.5491913365289,
            "pValueMantissa": 6.279,
            "pValueExponent": -12,
            "beta": -0.175345,
            "standardError": 0.0255115,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11588255_T_C",
            "posteriorProbability": 0.00460353479323945,
            "logBF": 19.5468202675168,
            "pValueMantissa": 6.227,
            "pValueExponent": -12,
            "beta": -0.174964,
            "standardError": 0.0254517,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11595911_A_G",
            "posteriorProbability": 0.00455985195065135,
            "logBF": 19.5372859818394,
            "pValueMantissa": 6.375,
            "pValueExponent": -12,
            "beta": -0.175364,
            "standardError": 0.0255223,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594989_T_C",
            "posteriorProbability": 0.00448697942493362,
            "logBF": 19.521175567302,
            "pValueMantissa": 6.5,
            "pValueExponent": -12,
            "beta": -0.175276,
            "standardError": 0.0255198,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594783_C_G",
            "posteriorProbability": 0.00441945230033188,
            "logBF": 19.5060116002622,
            "pValueMantissa": 6.599,
            "pValueExponent": -12,
            "beta": -0.175197,
            "standardError": 0.0255164,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          }
        ]
      },
      {
        "variantId": "2_11594935_C_A",
        "study.id": "FINNGEN_R10_N14_ENDOMETRIOSIS",
        "study.traitFromSource": "Endometriosis",
        "study.disease.id": "EFO_0001065",
        "study.disease.traitFromSource": "Endometriosis",
        "pValueMantissa": 1.168,
        "pValueExponent": -17,
        "beta": -0.106982,
        "posteriorProbability": 0.0243991752277251,
        "ldPopulationStructure": [
          {
            "ldPopulation": "fin",
            "relativeSampleSize": 1.0
          }
        ],
        "finemappingMethod": "SuSie",
        "l2g.score": 0.8306605219841003,
        "l2g.target.id": "ENSG00000196208",
        "l2g.target.approvedSymbol": "GREB1",
        "locus": [
          {
            "variantId": "2_11595009_A_T",
            "posteriorProbability": 0.0787717269884183,
            "logBF": 34.7356864276406,
            "pValueMantissa": 9.057,
            "pValueExponent": -19,
            "beta": -0.10679,
            "standardError": 0.0120719,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594989_T_C",
            "posteriorProbability": 0.060983160107364,
            "logBF": 34.4797300519691,
            "pValueMantissa": 1.187,
            "pValueExponent": -18,
            "beta": -0.106328,
            "standardError": 0.0120609,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594783_C_G",
            "posteriorProbability": 0.0605667073110902,
            "logBF": 34.4728776475251,
            "pValueMantissa": 1.194,
            "pValueExponent": -18,
            "beta": -0.106307,
            "standardError": 0.0120594,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594779_G_A",
            "posteriorProbability": 0.0603960886615738,
            "logBF": 34.4700566353073,
            "pValueMantissa": 1.198,
            "pValueExponent": -18,
            "beta": -0.106303,
            "standardError": 0.0120594,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594209_A_C",
            "posteriorProbability": 0.0597718026931926,
            "logBF": 34.4596663126053,
            "pValueMantissa": 1.209,
            "pValueExponent": -18,
            "beta": -0.106269,
            "standardError": 0.012057,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11595911_A_G",
            "posteriorProbability": 0.05874809306986,
            "logBF": 34.4423909838342,
            "pValueMantissa": 1.23,
            "pValueExponent": -18,
            "beta": -0.106294,
            "standardError": 0.0120625,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594189_T_C",
            "posteriorProbability": 0.057869982952299,
            "logBF": 34.4273311107217,
            "pValueMantissa": 1.247,
            "pValueExponent": -18,
            "beta": -0.10623,
            "standardError": 0.0120573,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594754_A_G",
            "posteriorProbability": 0.0568069674827333,
            "logBF": 34.4087912748758,
            "pValueMantissa": 1.271,
            "pValueExponent": -18,
            "beta": -0.106224,
            "standardError": 0.0120596,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11588255_T_C",
            "posteriorProbability": 0.0504412385169347,
            "logBF": 34.2899413547786,
            "pValueMantissa": 1.417,
            "pValueExponent": -18,
            "beta": -0.105798,
            "standardError": 0.0120279,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587862_G_C",
            "posteriorProbability": 0.0485113408761384,
            "logBF": 34.2509298928287,
            "pValueMantissa": 1.476,
            "pValueExponent": -18,
            "beta": -0.105708,
            "standardError": 0.0120238,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11591720_T_C",
            "posteriorProbability": 0.044193562382918,
            "logBF": 34.1577114207528,
            "pValueMantissa": 1.604,
            "pValueExponent": -18,
            "beta": -0.105729,
            "standardError": 0.0120391,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587381_G_A",
            "posteriorProbability": 0.043634431424912,
            "logBF": 34.1449788399995,
            "pValueMantissa": 1.653,
            "pValueExponent": -18,
            "beta": -0.105535,
            "standardError": 0.0120216,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584349_A_G",
            "posteriorProbability": 0.0392030335879795,
            "logBF": 34.0378864209727,
            "pValueMantissa": 1.051,
            "pValueExponent": -17,
            "beta": -0.102908,
            "standardError": 0.0120105,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11591648_T_G",
            "posteriorProbability": 0.0369432102786038,
            "logBF": 33.9785141659311,
            "pValueMantissa": 1.942,
            "pValueExponent": -18,
            "beta": -0.105472,
            "standardError": 0.0120393,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584558_A_G",
            "posteriorProbability": 0.032931718496015,
            "logBF": 33.8635685710838,
            "pValueMantissa": 1.26,
            "pValueExponent": -17,
            "beta": -0.102566,
            "standardError": 0.0119997,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594935_C_A",
            "posteriorProbability": 0.0243991752277251,
            "logBF": 33.5636816193075,
            "pValueMantissa": 1.168,
            "pValueExponent": -17,
            "beta": -0.106982,
            "standardError": 0.0125036,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11581409_T_G",
            "posteriorProbability": 0.0207331981067797,
            "logBF": 33.4008684785968,
            "pValueMantissa": 4.618,
            "pValueExponent": -17,
            "beta": -0.10386,
            "standardError": 0.0123701,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584923_T_C",
            "posteriorProbability": 0.0207225380187541,
            "logBF": 33.4003541908646,
            "pValueMantissa": 1.676,
            "pValueExponent": -17,
            "beta": -0.102263,
            "standardError": 0.0120107,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11593419_A_AACTC",
            "posteriorProbability": 0.0206328555484528,
            "logBF": 33.3960170245049,
            "pValueMantissa": 1.34,
            "pValueExponent": -17,
            "beta": -0.106627,
            "standardError": 0.0124853,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11593362_G_T",
            "posteriorProbability": 0.0199459111614598,
            "logBF": 33.3621564577392,
            "pValueMantissa": 1.385,
            "pValueExponent": -17,
            "beta": -0.106579,
            "standardError": 0.0124853,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587954_G_A",
            "posteriorProbability": 0.0187770795900151,
            "logBF": 33.3017692450209,
            "pValueMantissa": 1.434,
            "pValueExponent": -17,
            "beta": -0.106207,
            "standardError": 0.0124476,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587963_C_T",
            "posteriorProbability": 0.0185894005802977,
            "logBF": 33.2917238467343,
            "pValueMantissa": 1.447,
            "pValueExponent": -17,
            "beta": -0.106198,
            "standardError": 0.012448,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11588262_T_C",
            "posteriorProbability": 0.0183696770169617,
            "logBF": 33.2798336067021,
            "pValueMantissa": 1.468,
            "pValueExponent": -17,
            "beta": -0.106187,
            "standardError": 0.0124492,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          }
        ]
      },
      {
        "variantId": "2_11594935_C_A",
        "study.id": "FINNGEN_R10_N14_ENDOMETRIOSIS_RECTPVAGSEPT_VAGINA",
        "study.traitFromSource": "Endometriosis of rectovaginal septum and vagina",
        "study.disease.id": "MONDO_0001288",
        "study.disease.traitFromSource": "Endometriosis of rectovaginal septum and vagina",
        "pValueMantissa": 3.821,
        "pValueExponent": -14,
        "beta": -0.220824,
        "posteriorProbability": 0.126594131108958,
        "ldPopulationStructure": [
          {
            "ldPopulation": "fin",
            "relativeSampleSize": 1.0
          }
        ],
        "finemappingMethod": "SuSie",
        "l2g.score": 0.6594920754432678,
        "l2g.target.id": "ENSG00000196208",
        "l2g.target.approvedSymbol": "GREB1",
        "locus": [
          {
            "variantId": "2_11594935_C_A",
            "posteriorProbability": 0.126594131108958,
            "logBF": 25.7168564403645,
            "pValueMantissa": 3.821,
            "pValueExponent": -14,
            "beta": -0.220824,
            "standardError": 0.0291827,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587954_G_A",
            "posteriorProbability": 0.101663232971024,
            "logBF": 25.4975360027916,
            "pValueMantissa": 4.782,
            "pValueExponent": -14,
            "beta": -0.218896,
            "standardError": 0.02904,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11588262_T_C",
            "posteriorProbability": 0.100836189567577,
            "logBF": 25.4893676041698,
            "pValueMantissa": 4.823,
            "pValueExponent": -14,
            "beta": -0.218893,
            "standardError": 0.0290439,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587963_C_T",
            "posteriorProbability": 0.100665524168083,
            "logBF": 25.4876736687968,
            "pValueMantissa": 4.829,
            "pValueExponent": -14,
            "beta": -0.218868,
            "standardError": 0.0290413,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11593419_A_AACTC",
            "posteriorProbability": 0.0859701043798914,
            "logBF": 25.3298699018069,
            "pValueMantissa": 5.728,
            "pValueExponent": -14,
            "beta": -0.218877,
            "standardError": 0.0291286,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11592421_G_GAATCAC",
            "posteriorProbability": 0.0859474274941319,
            "logBF": 25.3296060905988,
            "pValueMantissa": 5.712,
            "pValueExponent": -14,
            "beta": -0.218705,
            "standardError": 0.0291043,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11593362_G_T",
            "posteriorProbability": 0.0839000811151349,
            "logBF": 25.3054968697581,
            "pValueMantissa": 5.874,
            "pValueExponent": -14,
            "beta": -0.218785,
            "standardError": 0.0291291,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11583732_G_A",
            "posteriorProbability": 0.0635025210250819,
            "logBF": 25.0269498957711,
            "pValueMantissa": 1.089,
            "pValueExponent": -13,
            "beta": -0.214866,
            "standardError": 0.0289203,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11585115_G_A",
            "posteriorProbability": 0.0527660062407118,
            "logBF": 24.8417374516498,
            "pValueMantissa": 1.33,
            "pValueExponent": -13,
            "beta": -0.214195,
            "standardError": 0.0289332,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11582984_G_A",
            "posteriorProbability": 0.0377806982998492,
            "logBF": 24.5076686347012,
            "pValueMantissa": 1.883,
            "pValueExponent": -13,
            "beta": -0.212903,
            "standardError": 0.0289395,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584454_G_T",
            "posteriorProbability": 0.0356632599705868,
            "logBF": 24.4499913158667,
            "pValueMantissa": 1.996,
            "pValueExponent": -13,
            "beta": -0.212465,
            "standardError": 0.0289103,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11581409_T_G",
            "posteriorProbability": 0.030107371255855,
            "logBF": 24.2806403234728,
            "pValueMantissa": 1.765,
            "pValueExponent": -13,
            "beta": -0.212167,
            "standardError": 0.0288055,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11585053_G_GA",
            "posteriorProbability": 0.00827222528750481,
            "logBF": 22.9887738418231,
            "pValueMantissa": 9.221,
            "pValueExponent": -13,
            "beta": -0.206461,
            "standardError": 0.0289094,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584558_A_G",
            "posteriorProbability": 0.00771397376123689,
            "logBF": 22.9189037478112,
            "pValueMantissa": 6.725,
            "pValueExponent": -13,
            "beta": -0.199468,
            "standardError": 0.0277621,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11588255_T_C",
            "posteriorProbability": 0.00732279445430058,
            "logBF": 22.866862300653,
            "pValueMantissa": 4.884,
            "pValueExponent": -13,
            "beta": -0.201243,
            "standardError": 0.0278404,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587381_G_A",
            "posteriorProbability": 0.00705714277057586,
            "logBF": 22.8299105523501,
            "pValueMantissa": 5.079,
            "pValueExponent": -13,
            "beta": -0.200992,
            "standardError": 0.027826,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587862_G_C",
            "posteriorProbability": 0.00691953754350544,
            "logBF": 22.8102192279013,
            "pValueMantissa": 5.183,
            "pValueExponent": -13,
            "beta": -0.200949,
            "standardError": 0.0278307,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584349_A_G",
            "posteriorProbability": 0.00520423577912928,
            "logBF": 22.5253431563905,
            "pValueMantissa": 1.016,
            "pValueExponent": -12,
            "beta": -0.19809,
            "standardError": 0.0277891,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594189_T_C",
            "posteriorProbability": 0.00515759984014673,
            "logBF": 22.5163416134987,
            "pValueMantissa": 7.081,
            "pValueExponent": -13,
            "beta": -0.200319,
            "standardError": 0.0279078,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          }
        ]
      },
      {
        "variantId": "2_11594935_C_A",
        "study.id": "FINNGEN_R10_N14_ENDOMETRIOSIS_PELVICPERITONEUM",
        "study.traitFromSource": "Endometriosis of pelvic peritoneum",
        "study.disease.id": "MONDO_0001285",
        "study.disease.traitFromSource": "Endometriosis of pelvic peritoneum",
        "pValueMantissa": 6.786,
        "pValueExponent": -7,
        "beta": -0.095918,
        "posteriorProbability": 0.00641158923615498,
        "ldPopulationStructure": [
          {
            "ldPopulation": "fin",
            "relativeSampleSize": 1.0
          }
        ],
        "finemappingMethod": "SuSie",
        "l2g.score": 0.825407087802887,
        "l2g.target.id": "ENSG00000196208",
        "l2g.target.approvedSymbol": "GREB1",
        "locus": [
          {
            "variantId": "2_11595009_A_T",
            "posteriorProbability": 0.0968229650288976,
            "logBF": 13.3912959694757,
            "pValueMantissa": 2.902,
            "pValueExponent": -8,
            "beta": -0.103435,
            "standardError": 0.0186461,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594209_A_C",
            "posteriorProbability": 0.0729212983177048,
            "logBF": 13.1077925156346,
            "pValueMantissa": 3.915,
            "pValueExponent": -8,
            "beta": -0.10232,
            "standardError": 0.0186218,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594189_T_C",
            "posteriorProbability": 0.0717268014647786,
            "logBF": 13.091276239123,
            "pValueMantissa": 3.978,
            "pValueExponent": -8,
            "beta": -0.102272,
            "standardError": 0.0186225,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594779_G_A",
            "posteriorProbability": 0.0712546914784429,
            "logBF": 13.0846724235891,
            "pValueMantissa": 4.023,
            "pValueExponent": -8,
            "beta": -0.10225,
            "standardError": 0.0186253,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594783_C_G",
            "posteriorProbability": 0.0712341246855076,
            "logBF": 13.0843837441877,
            "pValueMantissa": 4.025,
            "pValueExponent": -8,
            "beta": -0.102249,
            "standardError": 0.0186253,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594989_T_C",
            "posteriorProbability": 0.0704137212415007,
            "logBF": 13.0727999094679,
            "pValueMantissa": 4.075,
            "pValueExponent": -8,
            "beta": -0.10222,
            "standardError": 0.0186277,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11595911_A_G",
            "posteriorProbability": 0.0703967644949547,
            "logBF": 13.072559064526,
            "pValueMantissa": 4.096,
            "pValueExponent": -8,
            "beta": -0.102219,
            "standardError": 0.0186306,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594754_A_G",
            "posteriorProbability": 0.0702890686513858,
            "logBF": 13.0710280523096,
            "pValueMantissa": 4.079,
            "pValueExponent": -8,
            "beta": -0.102207,
            "standardError": 0.0186258,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11588255_T_C",
            "posteriorProbability": 0.057583407141511,
            "logBF": 12.8716462170383,
            "pValueMantissa": 4.934,
            "pValueExponent": -8,
            "beta": -0.101316,
            "standardError": 0.0185777,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587381_G_A",
            "posteriorProbability": 0.0565576442877265,
            "logBF": 12.8536721322249,
            "pValueMantissa": 5.015,
            "pValueExponent": -8,
            "beta": -0.101213,
            "standardError": 0.0185685,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587862_G_C",
            "posteriorProbability": 0.0563640979250794,
            "logBF": 12.8502441554972,
            "pValueMantissa": 5.042,
            "pValueExponent": -8,
            "beta": -0.101214,
            "standardError": 0.0185719,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11591648_T_G",
            "posteriorProbability": 0.0518392349406676,
            "logBF": 12.7665590551427,
            "pValueMantissa": 5.56,
            "pValueExponent": -8,
            "beta": -0.101014,
            "standardError": 0.0185947,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11591720_T_C",
            "posteriorProbability": 0.0475167776593992,
            "logBF": 12.6794946238539,
            "pValueMantissa": 6.107,
            "pValueExponent": -8,
            "beta": -0.100702,
            "standardError": 0.0185947,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584923_T_C",
            "posteriorProbability": 0.0263066065515095,
            "logBF": 12.0882318686121,
            "pValueMantissa": 1.264,
            "pValueExponent": -7,
            "beta": -0.0980066,
            "standardError": 0.018548,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11578465_C_T",
            "posteriorProbability": 0.0120065559268393,
            "logBF": 11.3038645891388,
            "pValueMantissa": 3.454,
            "pValueExponent": -7,
            "beta": 0.0974399,
            "standardError": 0.0191178,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584558_A_G",
            "posteriorProbability": 0.0103783278553384,
            "logBF": 11.1581315331228,
            "pValueMantissa": 3.462,
            "pValueExponent": -7,
            "beta": -0.0944529,
            "standardError": 0.0185332,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11584349_A_G",
            "posteriorProbability": 0.0101171975106718,
            "logBF": 11.1326484609819,
            "pValueMantissa": 3.535,
            "pValueExponent": -7,
            "beta": -0.0944569,
            "standardError": 0.0185484,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11581409_T_G",
            "posteriorProbability": 0.00820041385034962,
            "logBF": 10.9225963838481,
            "pValueMantissa": 5.027,
            "pValueExponent": -7,
            "beta": -0.0958947,
            "standardError": 0.0190825,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594935_C_A",
            "posteriorProbability": 0.00641158923615498,
            "logBF": 10.6765189322568,
            "pValueMantissa": 6.786,
            "pValueExponent": -7,
            "beta": -0.095918,
            "standardError": 0.0193095,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11593419_A_AACTC",
            "posteriorProbability": 0.0043797563654958,
            "logBF": 10.2954048598218,
            "pValueMantissa": 9.945,
            "pValueExponent": -7,
            "beta": -0.0943251,
            "standardError": 0.0192787,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11593362_G_T",
            "posteriorProbability": 0.00431482605400924,
            "logBF": 10.2804687730865,
            "pValueMantissa": 1.01,
            "pValueExponent": -6,
            "beta": -0.0942685,
            "standardError": 0.0192791,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11578732_T_C",
            "posteriorProbability": 0.0037619461670644,
            "logBF": 10.1433481824145,
            "pValueMantissa": 9.056,
            "pValueExponent": -7,
            "beta": 0.0924575,
            "standardError": 0.0188262,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          }
        ]
      },
      {
        "variantId": "2_11594935_C_A",
        "study.id": "FINNGEN_R10_N14_ENDOMETRIOSIS_ASRM_STAGE3_4",
        "study.traitFromSource": "Endomtriosis ASRM stages 3,4",
        "study.disease.id": "EFO_0001065",
        "study.disease.traitFromSource": "Endomtriosis ASRM stages 3,4",
        "pValueMantissa": 1.016,
        "pValueExponent": -17,
        "beta": -0.142225,
        "posteriorProbability": 0.122413904830971,
        "ldPopulationStructure": [
          {
            "ldPopulation": "fin",
            "relativeSampleSize": 1.0
          }
        ],
        "finemappingMethod": "SuSie",
        "l2g.score": 0.8896055221557617,
        "l2g.target.id": "ENSG00000196208",
        "l2g.target.approvedSymbol": "GREB1",
        "locus": [
          {
            "variantId": "2_11593419_A_AACTC",
            "posteriorProbability": 0.189160147932363,
            "logBF": 35.0639884167124,
            "pValueMantissa": 6.226,
            "pValueExponent": -18,
            "beta": -0.142948,
            "standardError": 0.0165673,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11593362_G_T",
            "posteriorProbability": 0.185721389511439,
            "logBF": 35.0456420617663,
            "pValueMantissa": 6.339,
            "pValueExponent": -18,
            "beta": -0.142916,
            "standardError": 0.0165675,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11594935_C_A",
            "posteriorProbability": 0.122413904830971,
            "logBF": 34.6288023820744,
            "pValueMantissa": 1.016,
            "pValueExponent": -17,
            "beta": -0.142225,
            "standardError": 0.0165916,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11588262_T_C",
            "posteriorProbability": 0.120006419495847,
            "logBF": 34.608939654038,
            "pValueMantissa": 9.658,
            "pValueExponent": -18,
            "beta": -0.141728,
            "standardError": 0.0165224,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587954_G_A",
            "posteriorProbability": 0.118888519093094,
            "logBF": 34.5995806565711,
            "pValueMantissa": 9.745,
            "pValueExponent": -18,
            "beta": -0.141693,
            "standardError": 0.0165203,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11587963_C_T",
            "posteriorProbability": 0.11809942979467,
            "logBF": 34.5929213119229,
            "pValueMantissa": 9.802,
            "pValueExponent": -18,
            "beta": -0.141688,
            "standardError": 0.016521,
            "is95CredibleSet": true,
            "is99CredibleSet": true
          },
          {
            "variantId": "2_11592421_G_GAATCAC",
            "posteriorProbability": 0.112724255460893,
            "logBF": 34.5463390362579,
            "pValueMantissa": 1.04,
            "pValueExponent": -17,
            "beta": -0.141861,
            "standardError": 0.0165544,
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


