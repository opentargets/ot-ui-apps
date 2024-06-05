import {
  Link,
  Tooltip,
  SectionItem,
  PublicationsDrawer,
  DataTable,
  ClinvarStars,
  ScientificNotation,
} from "ui";
import { Typography } from "@mui/material";
import { naLabel, defaultRowsPerPageOptions } from "../../constants";
import { definition } from ".";
import Description from "./Description";
// import { sentenceCase } from "../../utils/global";

function getColumns(id: string, label: string) {

  // !!!
  // id = "10_100315722_G_A";

  return [
    {
      id: "leadVariant",
      label: "Lead Variant",
      renderCell: ({ variantId }) => (
        variantId === id
          ? `${variantId} (self)`
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
    // {
    //   id: "ldr2",
    //   label: "LD (r2)",
    //   tooltip: "Linkage disequilibrium with the queried variant",
    //   renderCell: ({ locus }) => (
    //     // <small><i>fake page variant!</i></small>  // !! TEST DATA IS NOT FOR THE PAGE VARIANT SO NO MATCH!
    //     console.log(locus), locus.find(obj => obj.variantId === id).r2Overall.toFixed(0)
    //   )
    // },
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

function Body({ id, label, entity }: BodyProps) {
  
  const columns = getColumns(id, label);
  const rows = request.data.variant.gwasCredibleSets;

  // USE SORT BY PVALUE IN TABLE !!!!!!!!

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description variantId={id} />}
      renderBody={() => (
        <DataTable
          // !! TO DO: add dataDownloader
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


// !! HARDCODE DATA FOR NOW !!
function mockQuery() {
  return {
    loading: false,
    error: undefined,
    data: JSON.parse(`
{ 
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
        },
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
        },
        {
          "variantId": "10_102578181_G_A",
          "study.id": "GCST90002302",
          "study.traitFromSource": "Eosinophil counts",
          "study.disease.id": "EFO_0004842",
          "study.disease.name": "Eosinophil counts",
          "pValueMantissa": 4.0,
          "pValueExponent": -11,
          "ldPopulationStructure": [
            {
              "ldPopulation": "afr",
              "relativeSampleSize": 0.3333333333333333
            },
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 0.16666666666666666
            },
            {
              "ldPopulation": "eas",
              "relativeSampleSize": 0.3333333333333333
            },
            {
              "ldPopulation": "amr",
              "relativeSampleSize": 0.16666666666666666
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.28852343559265137,
          "l2g.target.id": "ENSG00000138111",
          "l2g.target.approvedSymbol": "MFSD13A",
          "locus": [
            {
              "variantId": "10_102578181_G_A",
              "r2Overall": 1.0000000000000018,
              "posteriorProbability": 0.3006922831631714,
              "standardError": 0.9999997179240416,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102600127_C_T",
              "r2Overall": 0.9546837249485643,
              "posteriorProbability": 0.129689961678705,
              "standardError": 0.251910487985645,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102556824_C_A",
              "r2Overall": 0.9227681490722656,
              "posteriorProbability": 0.08888812955055676,
              "standardError": 0.17068024407875146,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102583671_C_A",
              "r2Overall": 0.9093205634523532,
              "posteriorProbability": 0.07622223414327493,
              "standardError": 0.149382655483879,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102583047_G_A",
              "r2Overall": 0.9063773014485388,
              "posteriorProbability": 0.07371228295100894,
              "standardError": 0.14534521626918073,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102631277_C_T",
              "r2Overall": 0.8699209599403269,
              "posteriorProbability": 0.048690717064057226,
              "standardError": 0.10787793442361128,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102544910_G_A",
              "r2Overall": 0.8441005758648841,
              "posteriorProbability": 0.03614157900548334,
              "standardError": 0.09053900268402228,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102539435_ATTGT_A",
              "r2Overall": 0.8382296639847228,
              "posteriorProbability": 0.033743197345844064,
              "standardError": 0.08728854280140691,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102589092_T_TTG",
              "r2Overall": 0.8106232479852495,
              "posteriorProbability": 0.02429350644917803,
              "standardError": 0.07452068593199909,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102517366_A_C",
              "r2Overall": 0.810384893507543,
              "posteriorProbability": 0.02422359200827094,
              "standardError": 0.0744257569662219,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102514572_G_C",
              "r2Overall": 0.805723947370403,
              "posteriorProbability": 0.022892303084296472,
              "standardError": 0.07261449113925872,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102490521_A_G",
              "r2Overall": 0.7772905576754877,
              "posteriorProbability": 0.016095251717423053,
              "standardError": 0.06317488258420187,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102481926_G_T",
              "r2Overall": 0.7770712444716228,
              "posteriorProbability": 0.01605072830117274,
              "standardError": 0.063111393458017,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102508869_T_C",
              "r2Overall": 0.7758690676552555,
              "posteriorProbability": 0.015808610769407067,
              "standardError": 0.06276560745734434,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102553620_C_T",
              "r2Overall": 0.771135481632334,
              "posteriorProbability": 0.0148865155485586,
              "standardError": 0.0614398971630269,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102491485_T_C",
              "r2Overall": 0.7696203843548749,
              "posteriorProbability": 0.01460164468628998,
              "standardError": 0.06102729178548176,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102486561_G_A",
              "r2Overall": 0.7677009200887309,
              "posteriorProbability": 0.014247699715608192,
              "standardError": 0.06051246743868377,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102625375_G_A",
              "r2Overall": 0.7465879755941777,
              "posteriorProbability": 0.01082741112163572,
              "standardError": 0.055381040242994416,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102510460_G_A",
              "r2Overall": 0.7441315926880894,
              "posteriorProbability": 0.01048112049502468,
              "standardError": 0.05484150839028032,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102474831_A_G",
              "r2Overall": 0.7390708002882006,
              "posteriorProbability": 0.009798405996659348,
              "standardError": 0.05376388593027488,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102640838_T_TA",
              "r2Overall": 0.6959008479269507,
              "posteriorProbability": 0.005393826486105157,
              "standardError": 0.04613924123954043,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102638531_A_G",
              "r2Overall": 0.6927259213104893,
              "posteriorProbability": 0.005153522377077681,
              "standardError": 0.045671786939746,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_102727686_G_A",
          "study.id": "GCST005962",
          "study.traitFromSource": "Waist-to-hip ratio adjusted for BMI x sex x age interaction (4df test)",
          "study.disease.id": "EFO_0008343",
          "study.disease.name": "Waist-to-hip ratio adjusted for BMI x sex x age interaction (4df test)",
          "pValueMantissa": 6.0,
          "pValueExponent": -7,
          "ldPopulationStructure": [
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 1.0
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.9135829210281372,
          "l2g.target.id": "ENSG00000156398",
          "l2g.target.approvedSymbol": "SFXN2",
          "locus": [
            {
              "variantId": "10_102727686_G_A",
              "r2Overall": 1.000000000000008,
              "posteriorProbability": 0.5430136349184788,
              "standardError": 0.9999995411039166,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102720118_G_A",
              "r2Overall": 0.7282346993239331,
              "posteriorProbability": 0.04860605814713165,
              "standardError": 0.10096699608666272,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102694943_T_C",
              "r2Overall": 0.7246861565673546,
              "posteriorProbability": 0.04712444661113918,
              "standardError": 0.09995362587567812,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102697699_G_A",
              "r2Overall": 0.7117919463566044,
              "posteriorProbability": 0.0420555452070537,
              "standardError": 0.0964773093338408,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102678808_C_T",
              "r2Overall": 0.7058010204343411,
              "posteriorProbability": 0.039860882645296795,
              "standardError": 0.0949649256490658,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102685789_AG_A",
              "r2Overall": 0.7050096592852099,
              "posteriorProbability": 0.03957829214991731,
              "standardError": 0.09476975004607772,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102682300_ACT_A",
              "r2Overall": 0.6973809513753556,
              "posteriorProbability": 0.03693905935945937,
              "standardError": 0.09294107964698856,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102703919_G_A",
              "r2Overall": 0.6931978463787024,
              "posteriorProbability": 0.03555553379500566,
              "standardError": 0.0919775546553424,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102676263_CT_C",
              "r2Overall": 0.6154652160888917,
              "posteriorProbability": 0.01669123992103913,
              "standardError": 0.07808753935507835,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102711161_T_C",
              "r2Overall": 0.5859227045527156,
              "posteriorProbability": 0.01220385487365295,
              "standardError": 0.07432734462009585,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102725968_G_A",
              "r2Overall": 0.5799849681165811,
              "posteriorProbability": 0.011438053199663786,
              "standardError": 0.07364818777988055,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102700278_G_A",
              "r2Overall": 0.5722534736725529,
              "posteriorProbability": 0.010502299360468322,
              "standardError": 0.07279879696321005,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102708017_G_A",
              "r2Overall": 0.5656875347092117,
              "posteriorProbability": 0.00975946491066222,
              "standardError": 0.07210718336648828,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102690079_A_G",
              "r2Overall": 0.5633670855403942,
              "posteriorProbability": 0.009507861752735412,
              "standardError": 0.07186906765992017,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102752249_A_G",
              "r2Overall": 0.5595710273511952,
              "posteriorProbability": 0.00910816360133741,
              "standardError": 0.07148644549982504,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102677418_A_C",
              "r2Overall": 0.5572496241161187,
              "posteriorProbability": 0.008870860150615379,
              "standardError": 0.07125661696337228,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102708677_C_T",
              "r2Overall": 0.5553764906626412,
              "posteriorProbability": 0.008683241303762544,
              "standardError": 0.07107343110095633,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102749636_T_A",
              "r2Overall": 0.550951862740355,
              "posteriorProbability": 0.008253445068136906,
              "standardError": 0.07064860106534612,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102727217_C_T",
              "r2Overall": 0.5313264373389576,
              "posteriorProbability": 0.006558985284226119,
              "standardError": 0.06889105860214208,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102640355_T_C",
              "r2Overall": 0.5273812499489785,
              "posteriorProbability": 0.006257073592082205,
              "standardError": 0.06856137759069932,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102638825_G_A",
              "r2Overall": 0.5224206672828677,
              "posteriorProbability": 0.005894451602449417,
              "standardError": 0.06815745552576821,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102639493_C_T",
              "r2Overall": 0.5158134769984102,
              "posteriorProbability": 0.005439615085071825,
              "standardError": 0.06763727337331085,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102745930_G_C",
              "r2Overall": 0.5096985765112,
              "posteriorProbability": 0.005045923030120209,
              "standardError": 0.06717338200531532,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102640608_AAAAAG_A",
              "r2Overall": 0.5079797066071382,
              "posteriorProbability": 0.004939783522776537,
              "standardError": 0.06704593693389409,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102641446_G_A",
              "r2Overall": 0.5067184334823772,
              "posteriorProbability": 0.004863130758255707,
              "standardError": 0.06695323041983148,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102737102_C_T",
              "r2Overall": 0.5064885711643724,
              "posteriorProbability": 0.004849272225101143,
              "standardError": 0.06693640843944129,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102731407_G_A",
              "r2Overall": 0.5061341081585076,
              "posteriorProbability": 0.004827968247259842,
              "standardError": 0.0669105120478952,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102622916_A_G",
              "r2Overall": 0.5018131112114105,
              "posteriorProbability": 0.004574690543128801,
              "standardError": 0.0665991024519473,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_102959339_G_A",
          "study.id": "GCST000999",
          "study.traitFromSource": "Coronary heart disease",
          "study.disease.id": "EFO_0001645",
          "study.disease.name": "Coronary heart disease",
          "pValueMantissa": 4.0,
          "pValueExponent": -6,
          "ldPopulationStructure": [
            {
              "ldPopulation": "eas",
              "relativeSampleSize": 0.4853636124967183
            },
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 0.5146363875032817
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.1835647225379944,
          "l2g.target.id": "ENSG00000076685",
          "l2g.target.approvedSymbol": "NT5C2",
          "locus": [
            {
              "variantId": "10_102959339_G_A",
              "r2Overall": 0.9999999999999996,
              "posteriorProbability": 0.013331395522234883,
              "standardError": 0.9999998983806322,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102925542_C_A",
              "r2Overall": 0.9876871563534976,
              "posteriorProbability": 0.010287366694198791,
              "standardError": 0.5901607883363761,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102961369_A_T",
              "r2Overall": 0.9846214627307918,
              "posteriorProbability": 0.009935625239569632,
              "standardError": 0.5552316526184852,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102988252_G_A",
              "r2Overall": 0.9843640677495404,
              "posteriorProbability": 0.009907849162293146,
              "standardError": 0.5525623984920633,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103004514_T_C",
              "r2Overall": 0.9836685102602184,
              "posteriorProbability": 0.009833978411542576,
              "standardError": 0.5455252179735947,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102962205_G_C",
              "r2Overall": 0.9835845606136632,
              "posteriorProbability": 0.009825176295970604,
              "standardError": 0.5446926417957352,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102979422_T_C",
              "r2Overall": 0.9829862104121024,
              "posteriorProbability": 0.00976311960409932,
              "standardError": 0.5388584221294543,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102953319_C_T",
              "r2Overall": 0.9824710033389044,
              "posteriorProbability": 0.009710609297898805,
              "standardError": 0.5339700669477447,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102953356_A_C",
              "r2Overall": 0.982020959188515,
              "posteriorProbability": 0.009665409211566466,
              "standardError": 0.5297974197848392,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102937759_G_A",
              "r2Overall": 0.9813411989374464,
              "posteriorProbability": 0.00959826777042348,
              "standardError": 0.5236587513296576,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103013607_C_T",
              "r2Overall": 0.9810669032021218,
              "posteriorProbability": 0.009571545853968454,
              "standardError": 0.5212352185280614,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102929908_A_T",
              "r2Overall": 0.9810500417324088,
              "posteriorProbability": 0.009569909990241186,
              "standardError": 0.521087215452849,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102947259_A_T",
              "r2Overall": 0.9808610807345493,
              "posteriorProbability": 0.009551630466661304,
              "standardError": 0.5194362188127378,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103005737_T_G",
              "r2Overall": 0.9805986217567688,
              "posteriorProbability": 0.00952640071275719,
              "standardError": 0.5171659748853676,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102924787_G_A",
              "r2Overall": 0.9800613285129014,
              "posteriorProbability": 0.009475316730307692,
              "standardError": 0.51259929165926,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102953405_C_T",
              "r2Overall": 0.9800559528654192,
              "posteriorProbability": 0.009474809392862668,
              "standardError": 0.5125541384136401,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103016448_C_T",
              "r2Overall": 0.9775038715936812,
              "posteriorProbability": 0.009241773591628246,
              "standardError": 0.492223809997876,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102981274_C_T",
              "r2Overall": 0.9770706216289826,
              "posteriorProbability": 0.009203660604750082,
              "standardError": 0.4889753934661299,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103025161_C_T",
              "r2Overall": 0.9768341179128416,
              "posteriorProbability": 0.009183020437809804,
              "standardError": 0.4872250421445119,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102901488_C_T",
              "r2Overall": 0.976569830360557,
              "posteriorProbability": 0.00916009074275878,
              "standardError": 0.48528777543574486,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103016770_G_A",
              "r2Overall": 0.9761966259253508,
              "posteriorProbability": 0.009127950079555865,
              "standardError": 0.4825850759483788,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102900247_A_G",
              "r2Overall": 0.975986890650343,
              "posteriorProbability": 0.00911000806323662,
              "standardError": 0.4810827951330048,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102969492_G_A",
              "r2Overall": 0.9758006218001912,
              "posteriorProbability": 0.009094145109091189,
              "standardError": 0.47975843285474307,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102934897_G_A",
              "r2Overall": 0.9753461042982832,
              "posteriorProbability": 0.009055715616989864,
              "standardError": 0.4765649148989304,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102902124_C_A",
              "r2Overall": 0.9750534063231986,
              "posteriorProbability": 0.009031172879726195,
              "standardError": 0.4745363624128472,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103007134_C_T",
              "r2Overall": 0.9750295527412384,
              "posteriorProbability": 0.009029179723751826,
              "standardError": 0.47437199418252335,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102977941_T_TG",
              "r2Overall": 0.9747013364489172,
              "posteriorProbability": 0.009001859958328296,
              "standardError": 0.47212467625116905,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102921386_A_G",
              "r2Overall": 0.9740895096802332,
              "posteriorProbability": 0.008951447885324195,
              "standardError": 0.4680052702396318,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103020281_G_A",
              "r2Overall": 0.9737545351748552,
              "posteriorProbability": 0.008924124350244526,
              "standardError": 0.46578733916544773,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102907000_G_A",
              "r2Overall": 0.9733784610990956,
              "posteriorProbability": 0.00889367626132296,
              "standardError": 0.46332795962580414,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103006363_C_T",
              "r2Overall": 0.971304896945594,
              "posteriorProbability": 0.008729913633758525,
              "standardError": 0.4503177480258264,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102963863_T_C",
              "r2Overall": 0.9712615646718392,
              "posteriorProbability": 0.008726562620858054,
              "standardError": 0.4500553076401748,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102892566_C_T",
              "r2Overall": 0.9705031903077272,
              "posteriorProbability": 0.008668364710229182,
              "standardError": 0.44552131100316433,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102905510_A_C",
              "r2Overall": 0.969775731320193,
              "posteriorProbability": 0.008613318486694535,
              "standardError": 0.4412741111478614,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102897712_C_A",
              "r2Overall": 0.9683355360088158,
              "posteriorProbability": 0.008506488075452663,
              "standardError": 0.4331443755567333,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102917369_C_T",
              "r2Overall": 0.9682599683874512,
              "posteriorProbability": 0.008500958738198509,
              "standardError": 0.4327276144826975,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102900095_T_C",
              "r2Overall": 0.9681439137485984,
              "posteriorProbability": 0.008492481345603238,
              "standardError": 0.4320894130290037,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102895593_T_C",
              "r2Overall": 0.9679179367012208,
              "posteriorProbability": 0.00847602426407653,
              "standardError": 0.4308531089585754,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103009518_A_C",
              "r2Overall": 0.9662274282181802,
              "posteriorProbability": 0.008354935342621004,
              "standardError": 0.42186239223533906,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102888726_CTT_C",
              "r2Overall": 0.9658982694174004,
              "posteriorProbability": 0.0083317602545846,
              "standardError": 0.4201627107047907,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102913340_G_A",
              "r2Overall": 0.9649648619697448,
              "posteriorProbability": 0.008266725436817739,
              "standardError": 0.415428657593726,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103033891_T_C",
              "r2Overall": 0.9644187234823408,
              "posteriorProbability": 0.008229130642375165,
              "standardError": 0.4127158380983776,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102878723_C_T",
              "r2Overall": 0.9637640316964644,
              "posteriorProbability": 0.008184495484306187,
              "standardError": 0.4095174347937017,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102922845_G_A",
              "r2Overall": 0.9634485303967408,
              "posteriorProbability": 0.008163150349756829,
              "standardError": 0.40799647441791537,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102932876_C_A",
              "r2Overall": 0.962759463437757,
              "posteriorProbability": 0.008116896697128038,
              "standardError": 0.4047195177805995,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103064630_G_A",
              "r2Overall": 0.9614663266311888,
              "posteriorProbability": 0.008031407195282258,
              "standardError": 0.398730169055452,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103065908_C_G",
              "r2Overall": 0.9610029809734686,
              "posteriorProbability": 0.008001179428129127,
              "standardError": 0.39663314927323023,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103076162_C_T",
              "r2Overall": 0.960260865414806,
              "posteriorProbability": 0.00795319600956437,
              "standardError": 0.39332636430616674,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103081210_A_G",
              "r2Overall": 0.9591856093164874,
              "posteriorProbability": 0.007884588159401268,
              "standardError": 0.3886447555348467,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102902458_C_T",
              "r2Overall": 0.9579866258236034,
              "posteriorProbability": 0.007809319182845519,
              "standardError": 0.3835708590121533,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103111447_A_G",
              "r2Overall": 0.9574957520452348,
              "posteriorProbability": 0.007778866963871815,
              "standardError": 0.3815363816734464,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103088673_C_T",
              "r2Overall": 0.9567631076136316,
              "posteriorProbability": 0.007733798408423983,
              "standardError": 0.3785445892922214,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103034147_C_T",
              "r2Overall": 0.9565992242273388,
              "posteriorProbability": 0.007723778853578474,
              "standardError": 0.3778825550264382,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103047141_G_C",
              "r2Overall": 0.95640505305744,
              "posteriorProbability": 0.007711936412950488,
              "standardError": 0.3771015210222119,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102900931_A_G",
              "r2Overall": 0.9561037389054136,
              "posteriorProbability": 0.007693620886033304,
              "standardError": 0.37589665089161706,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102937234_ATGATAGCCC_A",
              "r2Overall": 0.955953142044861,
              "posteriorProbability": 0.007684494637742221,
              "standardError": 0.37529768111367307,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103081722_C_T",
              "r2Overall": 0.955180487295062,
              "posteriorProbability": 0.007637959548925217,
              "standardError": 0.3722578451288595,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103032494_CAG_C",
              "r2Overall": 0.9548477369141716,
              "posteriorProbability": 0.007618065458540323,
              "standardError": 0.3709655730471381,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103111522_T_G",
              "r2Overall": 0.9546493380802988,
              "posteriorProbability": 0.007606245263964105,
              "standardError": 0.37019981705343186,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103092132_T_C",
              "r2Overall": 0.9541846271003032,
              "posteriorProbability": 0.007578678685544078,
              "standardError": 0.36841988365147266,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103091078_A_G",
              "r2Overall": 0.9533025797889446,
              "posteriorProbability": 0.007526810922887079,
              "standardError": 0.3650932435817728,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103126617_G_A",
              "r2Overall": 0.9531669484369378,
              "posteriorProbability": 0.007518887375173714,
              "standardError": 0.3645876118569689,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103124451_T_C",
              "r2Overall": 0.9530181516664684,
              "posteriorProbability": 0.007510210494245173,
              "standardError": 0.3640346823271582,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103096405_G_A",
              "r2Overall": 0.9528065136424464,
              "posteriorProbability": 0.007497897425801026,
              "standardError": 0.36325142732740656,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103104921_G_A",
              "r2Overall": 0.9526475977563263,
              "posteriorProbability": 0.007488673468949064,
              "standardError": 0.3626657413092417,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103104857_C_G",
              "r2Overall": 0.9524822351274358,
              "posteriorProbability": 0.007479095020987498,
              "standardError": 0.3620585105092145,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103091544_G_T",
              "r2Overall": 0.9519431469147894,
              "posteriorProbability": 0.007448007249218769,
              "standardError": 0.3600944315813247,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103138369_C_T",
              "r2Overall": 0.951549132467411,
              "posteriorProbability": 0.007425417975571496,
              "standardError": 0.35867372132642017,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103138580_C_T",
              "r2Overall": 0.9515295949308054,
              "posteriorProbability": 0.007424300752220136,
              "standardError": 0.35860359598718783,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103009952_T_C",
              "r2Overall": 0.9514918348313336,
              "posteriorProbability": 0.007422142269323805,
              "standardError": 0.3584681507751659,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102961915_TATTAA_T",
              "r2Overall": 0.9514621867102784,
              "posteriorProbability": 0.007420448201787613,
              "standardError": 0.3583618822331467,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103109281_T_C",
              "r2Overall": 0.9510986665092748,
              "posteriorProbability": 0.007399727532324841,
              "standardError": 0.35706453125121645,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103141274_A_G",
              "r2Overall": 0.9509329970686196,
              "posteriorProbability": 0.007390315211358331,
              "standardError": 0.3564767071968197,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103117545_T_C",
              "r2Overall": 0.9508848259263376,
              "posteriorProbability": 0.007387582026975014,
              "standardError": 0.35630618730843905,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103169959_T_C",
              "r2Overall": 0.9508608496491942,
              "posteriorProbability": 0.007386222239922454,
              "standardError": 0.3562213811811944,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103086421_T_C",
              "r2Overall": 0.9508452098775324,
              "posteriorProbability": 0.00738533546433934,
              "standardError": 0.35616608592844845,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103138144_T_C",
              "r2Overall": 0.9506680773070416,
              "posteriorProbability": 0.007375303928118224,
              "standardError": 0.35554114048210306,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103092155_C_T",
              "r2Overall": 0.9502396970375628,
              "posteriorProbability": 0.00735113326696129,
              "standardError": 0.3540396860697168,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103029718_T_G",
              "r2Overall": 0.9501020354286462,
              "posteriorProbability": 0.007343392713389482,
              "standardError": 0.35356014245003725,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103019055_C_T",
              "r2Overall": 0.9497837344178452,
              "posteriorProbability": 0.007325544481365375,
              "standardError": 0.3524567864761111,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103118786_C_T",
              "r2Overall": 0.9491017066170347,
              "posteriorProbability": 0.007287530939277316,
              "standardError": 0.35011785718660793,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103179458_T_C",
              "r2Overall": 0.9490800415140368,
              "posteriorProbability": 0.007286328505466453,
              "standardError": 0.3500441167241521,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103146454_T_C",
              "r2Overall": 0.9490172716431732,
              "posteriorProbability": 0.007282846476328843,
              "standardError": 0.3498306619358833,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103123580_A_G",
              "r2Overall": 0.9490071887803246,
              "posteriorProbability": 0.007282287393801185,
              "standardError": 0.34979640080094726,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103054591_GTGTTTTGTTTTTTTTGTTTTTT_G",
              "r2Overall": 0.9489150681625288,
              "posteriorProbability": 0.007277182533406935,
              "standardError": 0.34948371889755775,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103141734_T_C",
              "r2Overall": 0.9486896544579976,
              "posteriorProbability": 0.007264714862277128,
              "standardError": 0.3487211795945016,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103051446_T_C",
              "r2Overall": 0.9482851381969308,
              "posteriorProbability": 0.007242424540251617,
              "standardError": 0.34736185337101105,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102879895_GTATA_G",
              "r2Overall": 0.9473442582766164,
              "posteriorProbability": 0.00719098783923591,
              "standardError": 0.34424447591258456,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103107929_C_T",
              "r2Overall": 0.9470132028068612,
              "posteriorProbability": 0.007173023571279851,
              "standardError": 0.34316206656975357,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103097766_A_C",
              "r2Overall": 0.9444717046510458,
              "posteriorProbability": 0.00703736227837803,
              "standardError": 0.335092585838232,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103181189_T_C",
              "r2Overall": 0.9438267443279628,
              "posteriorProbability": 0.007003549902752888,
              "standardError": 0.3331097675955854,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103097008_CAA_C",
              "r2Overall": 0.9415168576346788,
              "posteriorProbability": 0.006884403474038404,
              "standardError": 0.32621163967581457,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103029823_G_A",
              "r2Overall": 0.941423096465014,
              "posteriorProbability": 0.006879630017773559,
              "standardError": 0.3259381301719663,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103056115_AAAAAG_A",
              "r2Overall": 0.9399813845707652,
              "posteriorProbability": 0.006806830180232376,
              "standardError": 0.32179378026940725,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103182487_T_G",
              "r2Overall": 0.937910672936716,
              "posteriorProbability": 0.006704182956234748,
              "standardError": 0.31603522989166155,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103169157_T_A",
              "r2Overall": 0.9363869607790578,
              "posteriorProbability": 0.00663003917824603,
              "standardError": 0.3119366242642726,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102989488_T_TA",
              "r2Overall": 0.935829791191136,
              "posteriorProbability": 0.00660321239039601,
              "standardError": 0.31046608762150535,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103068270_GGAGGCCAAGACAGT_G",
              "r2Overall": 0.9351342369372474,
              "posteriorProbability": 0.006569932634728385,
              "standardError": 0.30865092548658696,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102975480_A_AC",
              "r2Overall": 0.9338836931341274,
              "posteriorProbability": 0.0065106750332237645,
              "standardError": 0.3054436291966911,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103114004_G_C",
              "r2Overall": 0.9335281415840748,
              "posteriorProbability": 0.006493960162314199,
              "standardError": 0.30454463883511224,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103151202_G_A",
              "r2Overall": 0.9335065221649408,
              "posteriorProbability": 0.006492945689032875,
              "standardError": 0.30449015683263836,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103056070_A_G",
              "r2Overall": 0.930337076116646,
              "posteriorProbability": 0.0063464984853489215,
              "standardError": 0.29672067998413326,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103113496_TA_T",
              "r2Overall": 0.926781955467878,
              "posteriorProbability": 0.006187380596110981,
              "standardError": 0.2884897874025929,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103142674_G_GA",
              "r2Overall": 0.9248964756406896,
              "posteriorProbability": 0.006105083813383853,
              "standardError": 0.28431679339897303,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103192742_C_T",
              "r2Overall": 0.9196661455482164,
              "posteriorProbability": 0.0058839137842446885,
              "standardError": 0.27337790536016465,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102886288_TCCTCCCTC_T",
              "r2Overall": 0.9098574365368944,
              "posteriorProbability": 0.0054948516339888955,
              "standardError": 0.25506945398685626,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102897491_A_G",
              "r2Overall": 0.902768288916996,
              "posteriorProbability": 0.005232295270001745,
              "standardError": 0.24335069389838584,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103009635_T_A",
              "r2Overall": 0.9018432947914068,
              "posteriorProbability": 0.005199094909672257,
              "standardError": 0.24190378857966943,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102920380_T_A",
              "r2Overall": 0.8992659530969511,
              "posteriorProbability": 0.005107815991152633,
              "standardError": 0.23796516807186627,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102896282_G_A",
              "r2Overall": 0.8938751849804529,
              "posteriorProbability": 0.004922524780992425,
              "standardError": 0.23014409956003568,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103154183_T_C",
              "r2Overall": 0.8928502531212668,
              "posteriorProbability": 0.0048881256790576245,
              "standardError": 0.22871727349042945,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103171827_G_C",
              "r2Overall": 0.890837910792381,
              "posteriorProbability": 0.004821332157342705,
              "standardError": 0.2259688312029328,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103153896_G_A",
              "r2Overall": 0.8849623163494309,
              "posteriorProbability": 0.0046317700152837035,
              "standardError": 0.2183241456513064,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103186066_G_A",
              "r2Overall": 0.88427355401715,
              "posteriorProbability": 0.004610064294442641,
              "standardError": 0.21746318802700443,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102866213_C_T",
              "r2Overall": 0.8811839549132995,
              "posteriorProbability": 0.004513982823408727,
              "standardError": 0.21368688384990903,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102867473_G_T",
              "r2Overall": 0.8742684057640093,
              "posteriorProbability": 0.00430625186164127,
              "standardError": 0.20571189336017184,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103036129_G_GAC",
              "r2Overall": 0.8732255887831156,
              "posteriorProbability": 0.004275773867463228,
              "standardError": 0.20456309643495327,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103091350_C_CT",
              "r2Overall": 0.8627913110696195,
              "posteriorProbability": 0.003982313513348714,
              "standardError": 0.19376983370807327,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102979921_A_AT",
              "r2Overall": 0.8599901558065892,
              "posteriorProbability": 0.003906935576123593,
              "standardError": 0.191073563470242,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103089359_G_C",
              "r2Overall": 0.8559606835865972,
              "posteriorProbability": 0.003800901510920699,
              "standardError": 0.1873314633898301,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103101515_AT_A",
              "r2Overall": 0.8498962551056988,
              "posteriorProbability": 0.003646455234767008,
              "standardError": 0.18198414946811056,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102856906_T_C",
              "r2Overall": 0.8469191025101743,
              "posteriorProbability": 0.003572811723165249,
              "standardError": 0.1794764088318383,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103034329_G_T",
              "r2Overall": 0.8439652518785075,
              "posteriorProbability": 0.0035011159152868276,
              "standardError": 0.1770603879458116,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102870655_A_T",
              "r2Overall": 0.8400173944816348,
              "posteriorProbability": 0.003407371064179022,
              "standardError": 0.17393838130764755,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103199431_G_T",
              "r2Overall": 0.8181123455577907,
              "posteriorProbability": 0.002927396688916034,
              "standardError": 0.15857368679879108,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103143627_T_G",
              "r2Overall": 0.8144470023116221,
              "posteriorProbability": 0.002853275337306928,
              "standardError": 0.15628770109422666,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102868477_T_C",
              "r2Overall": 0.8105744145119561,
              "posteriorProbability": 0.002776763784929803,
              "standardError": 0.15395073250213284,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102905045_CA_C",
              "r2Overall": 0.8086147250843021,
              "posteriorProbability": 0.0027387361452189665,
              "standardError": 0.15279761930610922,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103199143_G_A",
              "r2Overall": 0.8075199640187845,
              "posteriorProbability": 0.002717691318539282,
              "standardError": 0.15216183548340445,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102876519_C_T",
              "r2Overall": 0.8033234871089817,
              "posteriorProbability": 0.002638322041749175,
              "standardError": 0.1497788781011135,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102989949_C_CTT",
              "r2Overall": 0.8022591188073025,
              "posteriorProbability": 0.002618514834741468,
              "standardError": 0.149187799661146,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103195021_TG_T",
              "r2Overall": 0.8019126553936075,
              "posteriorProbability": 0.0026120952805275496,
              "standardError": 0.14899653480630662,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103143615_T_G",
              "r2Overall": 0.7966812036334086,
              "posteriorProbability": 0.002516805612201252,
              "standardError": 0.14617472074139676,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103120099_C_CA",
              "r2Overall": 0.7960614245010733,
              "posteriorProbability": 0.002505718030516167,
              "standardError": 0.14584845083133255,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103069712_C_T",
              "r2Overall": 0.7896732822432353,
              "posteriorProbability": 0.002393862996648547,
              "standardError": 0.14258026678272503,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102883106_GT_G",
              "r2Overall": 0.7891107589291431,
              "posteriorProbability": 0.002384221975333442,
              "standardError": 0.14230052162424608,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102854593_C_T",
              "r2Overall": 0.7750156969740629,
              "posteriorProbability": 0.0021532200993693356,
              "standardError": 0.13568474564555927,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102853184_G_A",
              "r2Overall": 0.764727408545343,
              "posteriorProbability": 0.001996835824710902,
              "standardError": 0.1312937100449281,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102844806_C_T",
              "r2Overall": 0.76435885937735,
              "posteriorProbability": 0.001991416314248851,
              "standardError": 0.1311426999159901,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102836092_G_C",
              "r2Overall": 0.7634931582457882,
              "posteriorProbability": 0.0019787347718685437,
              "standardError": 0.130789629893293,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102853263_G_A",
              "r2Overall": 0.7590177450001296,
              "posteriorProbability": 0.0019142503282612536,
              "standardError": 0.1290004553023663,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102845159_T_G",
              "r2Overall": 0.7569179553296057,
              "posteriorProbability": 0.0018846078322309152,
              "standardError": 0.12818134178934848,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102831636_G_T",
              "r2Overall": 0.7558155888620954,
              "posteriorProbability": 0.0018692002380768945,
              "standardError": 0.12775638565826428,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102882480_T_G",
              "r2Overall": 0.7536197441397852,
              "posteriorProbability": 0.00183882289800086,
              "standardError": 0.12692011877016765,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102899670_C_CT",
              "r2Overall": 0.750983369464363,
              "posteriorProbability": 0.001802896942030611,
              "standardError": 0.1259337130609227,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102834750_A_G",
              "r2Overall": 0.7475693691590042,
              "posteriorProbability": 0.0017572457686225115,
              "standardError": 0.12468419792382716,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102877753_T_C",
              "r2Overall": 0.7437505952534733,
              "posteriorProbability": 0.0017073266388431727,
              "standardError": 0.12332261132469088,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102952623_C_CAA",
              "r2Overall": 0.7351702846244981,
              "posteriorProbability": 0.0015994490520339036,
              "standardError": 0.12039553241464444,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103197872_T_A",
              "r2Overall": 0.7322318595922762,
              "posteriorProbability": 0.0015638311058508358,
              "standardError": 0.11943323739814088,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102971028_CA_C",
              "r2Overall": 0.7230840166262635,
              "posteriorProbability": 0.0014571202781276502,
              "standardError": 0.11656050362963452,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102876898_G_C",
              "r2Overall": 0.7227783051689997,
              "posteriorProbability": 0.0014536608409119588,
              "standardError": 0.11646759927619672,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_103279484_G_A",
          "study.id": "GCST006478",
          "study.traitFromSource": "Worry",
          "study.disease.id": "EFO_0005230",
          "study.disease.name": "Worry",
          "pValueMantissa": 4.0,
          "pValueExponent": -8,
          "beta": -0.01352,
          "ldPopulationStructure": [
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 1.0
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.9157017469406128,
          "l2g.target.id": "ENSG00000076685",
          "l2g.target.approvedSymbol": "NT5C2",
          "locus": [
            {
              "variantId": "10_103279484_G_A",
              "r2Overall": 1.0,
              "posteriorProbability": 0.2049891260190945,
              "standardError": 0.9977000638225532,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103266444_C_T",
              "r2Overall": 0.9849135775070964,
              "posteriorProbability": 0.14481423346551964,
              "standardError": 0.5054355361600056,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103264621_T_C",
              "r2Overall": 0.983590620476348,
              "posteriorProbability": 0.14231518109607652,
              "standardError": 0.4911018528269865,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103247771_C_T",
              "r2Overall": 0.9777432113292868,
              "posteriorProbability": 0.13243005342565503,
              "standardError": 0.4380190472220471,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103332690_T_C",
              "r2Overall": 0.8509105243803824,
              "posteriorProbability": 0.04134051890475337,
              "standardError": 0.13682293710712898,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103320818_T_C",
              "r2Overall": 0.8463111169656307,
              "posteriorProbability": 0.039701885629100694,
              "standardError": 0.13342828354187472,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103368377_T_G",
              "r2Overall": 0.8440275035379357,
              "posteriorProbability": 0.03891080022361244,
              "standardError": 0.13180395823345786,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103221628_T_A",
              "r2Overall": 0.8363177097887405,
              "posteriorProbability": 0.036345617407633,
              "standardError": 0.1265987514731109,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103360989_GTTGTC_G",
              "r2Overall": 0.8236415341007496,
              "posteriorProbability": 0.032460133253288205,
              "standardError": 0.1188800093185576,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103247715_T_TAA",
              "r2Overall": 0.8128397837610064,
              "posteriorProbability": 0.02944808248724668,
              "standardError": 0.11301619296735783,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103408805_G_C",
              "r2Overall": 0.7605486406069144,
              "posteriorProbability": 0.018070671813379083,
              "standardError": 0.09144488097615004,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103209821_A_G",
              "r2Overall": 0.75072418845322,
              "posteriorProbability": 0.016426545991774132,
              "standardError": 0.08834032944688977,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103208293_T_G",
              "r2Overall": 0.7488746920480114,
              "posteriorProbability": 0.016131880874724662,
              "standardError": 0.08778216653682343,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103207922_C_G",
              "r2Overall": 0.7486138685989531,
              "posteriorProbability": 0.016090693678028765,
              "standardError": 0.0877040950349803,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103206414_C_T",
              "r2Overall": 0.7466070083690808,
              "posteriorProbability": 0.015776795709428217,
              "standardError": 0.08710862916931973,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103381277_T_A",
              "r2Overall": 0.7398322631088531,
              "posteriorProbability": 0.014755635331698123,
              "standardError": 0.0851649370141426,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103239702_T_TG",
              "r2Overall": 0.7241825097120392,
              "posteriorProbability": 0.01261083649224255,
              "standardError": 0.08103702250684713,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103409327_C_CT",
              "r2Overall": 0.67114045739944,
              "posteriorProbability": 0.007198537184534755,
              "standardError": 0.07003881571003277,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103416422_T_C",
              "r2Overall": 0.6678926811808842,
              "posteriorProbability": 0.006944948488513235,
              "standardError": 0.06948652369165001,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103208497_AT_A",
              "r2Overall": 0.6099904578749895,
              "posteriorProbability": 0.003545450434474039,
              "standardError": 0.06136001965053518,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103204136_C_T",
              "r2Overall": 0.6098823782400837,
              "posteriorProbability": 0.003540786214145348,
              "standardError": 0.06134745825611655,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103301740_CA_C",
              "r2Overall": 0.6069606651748898,
              "posteriorProbability": 0.0034166864452985337,
              "standardError": 0.06101104339844324,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103198487_C_T",
              "r2Overall": 0.5854453362576686,
              "posteriorProbability": 0.0026128518783160425,
              "standardError": 0.058710923923475176,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103138228_T_C",
              "r2Overall": 0.5830066442764263,
              "posteriorProbability": 0.0025330296737889582,
              "standardError": 0.05846872619495672,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103184236_G_A",
              "r2Overall": 0.5801537632427352,
              "posteriorProbability": 0.002442338922379328,
              "standardError": 0.05818989391981021,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103169619_CA_C",
              "r2Overall": 0.5730730623049284,
              "posteriorProbability": 0.0022293114346318595,
              "standardError": 0.05751824956454881,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_102940512_CG_C",
              "r2Overall": 0.5595836607897045,
              "posteriorProbability": 0.0018677472599282951,
              "standardError": 0.05631519277753947,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103349513_CCT_C",
              "r2Overall": 0.5521637751392846,
              "posteriorProbability": 0.0016915283560804673,
              "standardError": 0.05569371104041925,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_103455894_A_G",
          "study.id": "GCST90100220",
          "study.traitFromSource": "Estimated glomerular filtration rate (creatinine)",
          "study.disease.id": "EFO_0005208",
          "study.disease.name": "Estimated glomerular filtration rate (creatinine)",
          "pValueMantissa": 2.0,
          "pValueExponent": -11,
          "beta": 6.702,
          "ldPopulationStructure": [
            {
              "ldPopulation": "eas",
              "relativeSampleSize": 0.11887717428336972
            },
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 0.8001475483509185
            },
            {
              "ldPopulation": "amr",
              "relativeSampleSize": 0.015981753319837897
            },
            {
              "ldPopulation": "seu",
              "relativeSampleSize": 0.00821723677599562
            },
            {
              "ldPopulation": "afr",
              "relativeSampleSize": 0.05677628726987826
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.8333759903907776,
          "l2g.target.id": "ENSG00000185933",
          "l2g.target.approvedSymbol": "CALHM1",
          "locus": [
            {
              "variantId": "10_103455894_A_G",
              "r2Overall": 0.9999999999999968,
              "posteriorProbability": 0.5961955465005567,
              "standardError": 0.9999996235710936,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103442561_T_G",
              "r2Overall": 0.808943569204207,
              "posteriorProbability": 0.04468434108087096,
              "standardError": 0.0711418912245018,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103437057_G_A",
              "r2Overall": 0.8081183593735797,
              "posteriorProbability": 0.0442287089008094,
              "standardError": 0.070827102687338,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103427989_G_A",
              "r2Overall": 0.7667311519284221,
              "posteriorProbability": 0.026069890092727956,
              "standardError": 0.05787137307268718,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103421153_C_T",
              "r2Overall": 0.7632906955024716,
              "posteriorProbability": 0.024914462974048018,
              "standardError": 0.057000872778206486,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103445545_A_C",
              "r2Overall": 0.7623548024501569,
              "posteriorProbability": 0.024608139418591933,
              "standardError": 0.056768599132332245,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103432813_A_G",
              "r2Overall": 0.755962530728491,
              "posteriorProbability": 0.02260385828169251,
              "standardError": 0.055231798801284794,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103431999_C_CAA",
              "r2Overall": 0.7450316045837176,
              "posteriorProbability": 0.019510243770453704,
              "standardError": 0.052791321025996575,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103441808_G_A",
              "r2Overall": 0.7350445215876247,
              "posteriorProbability": 0.01701838713290228,
              "standardError": 0.0507486315005354,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103436140_A_G",
              "r2Overall": 0.7320846411032553,
              "posteriorProbability": 0.016336250933951996,
              "standardError": 0.05017470179697888,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103431586_CTG_C",
              "r2Overall": 0.7302958751200161,
              "posteriorProbability": 0.015935863286442226,
              "standardError": 0.04983447253932746,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103430013_C_T",
              "r2Overall": 0.7188520374499657,
              "posteriorProbability": 0.013573791257025312,
              "standardError": 0.04776940539730421,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103419457_C_T",
              "r2Overall": 0.7167302568167548,
              "posteriorProbability": 0.0131717100740979,
              "standardError": 0.04740665115260763,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103427060_G_C",
              "r2Overall": 0.7091034958536679,
              "posteriorProbability": 0.011812167965698148,
              "standardError": 0.04615112851760336,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103447117_T_C",
              "r2Overall": 0.702524480107525,
              "posteriorProbability": 0.01074092152019633,
              "standardError": 0.04512575212660268,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103425765_T_C",
              "r2Overall": 0.6940393134153489,
              "posteriorProbability": 0.009486945698511426,
              "standardError": 0.043876573590342104,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103426940_T_A",
              "r2Overall": 0.6848787492217678,
              "posteriorProbability": 0.008280560734211883,
              "standardError": 0.04261380161550419,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103444697_T_C",
              "r2Overall": 0.684857914144666,
              "posteriorProbability": 0.008277979931575393,
              "standardError": 0.042611025631923344,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103454008_G_A",
              "r2Overall": 0.6794648070955347,
              "posteriorProbability": 0.007633473281695391,
              "standardError": 0.04190649446884405,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103441820_C_T",
              "r2Overall": 0.676139745245665,
              "posteriorProbability": 0.00725869517922836,
              "standardError": 0.041485684526506736,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103469639_C_T",
              "r2Overall": 0.6758296331023973,
              "posteriorProbability": 0.007224589401750973,
              "standardError": 0.04144695080585317,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103428451_A_ACT",
              "r2Overall": 0.6717313212861898,
              "posteriorProbability": 0.006787047552993196,
              "standardError": 0.04094309843583327,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103471630_G_A",
              "r2Overall": 0.6716565214907096,
              "posteriorProbability": 0.006779285662241678,
              "standardError": 0.04093403944377912,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103471387_G_A",
              "r2Overall": 0.6709024788180924,
              "posteriorProbability": 0.006701479071672288,
              "standardError": 0.040842987766781275,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103466299_C_T",
              "r2Overall": 0.6704994512832617,
              "posteriorProbability": 0.006660218702725646,
              "standardError": 0.04079452260996221,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103461397_C_G",
              "r2Overall": 0.6636711502015148,
              "posteriorProbability": 0.005994658295145174,
              "standardError": 0.03999418852233052,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103434329_C_T",
              "r2Overall": 0.6620754036921269,
              "posteriorProbability": 0.005847924517202075,
              "standardError": 0.039812668921601325,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103423979_T_C",
              "r2Overall": 0.6590466291399933,
              "posteriorProbability": 0.005578182521530465,
              "standardError": 0.03947369763951985,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_103787759_T_G",
          "study.id": "GCST90104541",
          "study.traitFromSource": "Cardioembolic stroke",
          "study.disease.id": "EFO_1001976",
          "study.disease.name": "Cardioembolic stroke",
          "pValueMantissa": 8.0,
          "pValueExponent": -9,
          "beta": 1.15,
          "ldPopulationStructure": [
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 1.0
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.6032179594039917,
          "l2g.target.id": "ENSG00000076685",
          "l2g.target.approvedSymbol": "NT5C2",
          "locus": [
            {
              "variantId": "10_103787759_T_G",
              "r2Overall": 0.9999999999999988,
              "posteriorProbability": 0.0886881220030737,
              "standardError": 0.9999997872144089,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103769902_A_G",
              "r2Overall": 0.9402895162664648,
              "posteriorProbability": 0.03739440888850055,
              "standardError": 0.2502387680799867,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103759606_A_G",
              "r2Overall": 0.939109535708054,
              "posteriorProbability": 0.03696356600709391,
              "standardError": 0.2470814403788636,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103776904_G_T",
              "r2Overall": 0.9387585492624644,
              "posteriorProbability": 0.036836623320989935,
              "standardError": 0.24615711638801877,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103764406_C_A",
              "r2Overall": 0.9347425512116736,
              "posteriorProbability": 0.035422135863208505,
              "standardError": 0.23603736295478991,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103758786_G_A",
              "r2Overall": 0.9312906353709308,
              "posteriorProbability": 0.034259201930784966,
              "standardError": 0.22795823136586713,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103751843_G_C",
              "r2Overall": 0.930615886602465,
              "posteriorProbability": 0.03403728460042715,
              "standardError": 0.22644058281326945,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103789178_TG_T",
              "r2Overall": 0.9294745934759208,
              "posteriorProbability": 0.03366581040822576,
              "standardError": 0.22391711112606696,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103750323_G_C",
              "r2Overall": 0.92820224764818,
              "posteriorProbability": 0.0332573235330354,
              "standardError": 0.22116649593771645,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103775573_T_C",
              "r2Overall": 0.9273854172386812,
              "posteriorProbability": 0.03299815255996108,
              "standardError": 0.21943438429038792,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103757733_A_G",
              "r2Overall": 0.9259975768909048,
              "posteriorProbability": 0.03256319841807004,
              "standardError": 0.21655000906392888,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103751889_C_T",
              "r2Overall": 0.924922401009882,
              "posteriorProbability": 0.03223080869220766,
              "standardError": 0.21436464020739404,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103752428_C_T",
              "r2Overall": 0.924577460434484,
              "posteriorProbability": 0.03212500254547765,
              "standardError": 0.21367239298358784,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103754715_C_A",
              "r2Overall": 0.9220868067196,
              "posteriorProbability": 0.0313727473007461,
              "standardError": 0.20879745000540445,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103747909_C_G",
              "r2Overall": 0.9197411746804812,
              "posteriorProbability": 0.03068256605687583,
              "standardError": 0.20439579638370023,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103747387_C_T",
              "r2Overall": 0.9196850193722288,
              "posteriorProbability": 0.030666254131001824,
              "standardError": 0.20429257675545476,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103742652_G_C",
              "r2Overall": 0.9190435777990164,
              "posteriorProbability": 0.03048061805670014,
              "standardError": 0.20312050918591407,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103748744_C_T",
              "r2Overall": 0.9164663915730016,
              "posteriorProbability": 0.029747316396853567,
              "standardError": 0.19853710258437493,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103743078_T_C",
              "r2Overall": 0.9151434993549508,
              "posteriorProbability": 0.029378521545108945,
              "standardError": 0.19625968291061904,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103750144_C_T",
              "r2Overall": 0.9150589714278842,
              "posteriorProbability": 0.029355128808587694,
              "standardError": 0.19611584336600563,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103750784_C_CTT",
              "r2Overall": 0.906202243551033,
              "posteriorProbability": 0.027012667896842108,
              "standardError": 0.1820748705923482,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103750997_C_T",
              "r2Overall": 0.9047682651947352,
              "posteriorProbability": 0.026652625550657588,
              "standardError": 0.17997855911317467,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103742021_C_T",
              "r2Overall": 0.9044127362176018,
              "posteriorProbability": 0.026564146376122217,
              "standardError": 0.179465842666684,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103747803_T_TTTTA",
              "r2Overall": 0.8995570062152072,
              "posteriorProbability": 0.025386067669782707,
              "standardError": 0.17272939835906842,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103733419_G_T",
              "r2Overall": 0.8803109341856574,
              "posteriorProbability": 0.021217733433571067,
              "standardError": 0.15015782536020528,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103762002_C_T",
              "r2Overall": 0.8720980344532878,
              "posteriorProbability": 0.019652632240308245,
              "standardError": 0.14214743334432808,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103763658_G_A",
              "r2Overall": 0.8597780847322422,
              "posteriorProbability": 0.01751116782145192,
              "standardError": 0.13155112828118212,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103787093_A_G",
              "r2Overall": 0.8591624022217839,
              "posteriorProbability": 0.017410179254032716,
              "standardError": 0.13106110633885393,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103789531_TAC_T",
              "r2Overall": 0.8586205221341053,
              "posteriorProbability": 0.017321749835621618,
              "standardError": 0.13063270759159665,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103784239_T_C",
              "r2Overall": 0.8455082231283282,
              "posteriorProbability": 0.015305579983775382,
              "standardError": 0.12102975523570908,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103781828_G_A",
              "r2Overall": 0.8222460254400377,
              "posteriorProbability": 0.012250286490314307,
              "standardError": 0.10699523330179292,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103778024_G_A",
              "r2Overall": 0.8146141594571262,
              "posteriorProbability": 0.011375191878132344,
              "standardError": 0.10306537846962883,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103779104_C_T",
              "r2Overall": 0.8110238146725791,
              "posteriorProbability": 0.010983175804871669,
              "standardError": 0.10131466604179765,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103773432_TTTTC_T",
              "r2Overall": 0.8080857496328813,
              "posteriorProbability": 0.010671374464276372,
              "standardError": 0.09992586298342215,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103767821_T_TTTG",
              "r2Overall": 0.7711309847169002,
              "posteriorProbability": 0.007364728318309546,
              "standardError": 0.08528458506500276,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103720629_T_A",
              "r2Overall": 0.7699825476640084,
              "posteriorProbability": 0.007278309111747598,
              "standardError": 0.0849007577077126,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_103769135_CTGTGTGTGTGTGTGTGTGTG_C",
              "r2Overall": 0.7217769319543544,
              "posteriorProbability": 0.004358022114849697,
              "standardError": 0.07160678057846218,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_104804166_C_T",
          "study.id": "GCST007553",
          "study.traitFromSource": "Autism and major depressive disorder (MTAG)",
          "study.disease.id": "EFO_0003761",
          "study.disease.name": "Autism and major depressive disorder (MTAG)",
          "pValueMantissa": 1.0,
          "pValueExponent": -6,
          "beta": -0.05,
          "ldPopulationStructure": [
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 1.0
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.24315206706523895,
          "l2g.target.id": "ENSG00000156395",
          "l2g.target.approvedSymbol": "SORCS3",
          "locus": [
            {
              "variantId": "10_104804166_C_T",
              "r2Overall": 0.9999999999999982,
              "posteriorProbability": 0.15660336127879174,
              "standardError": 0.9999997877970216,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104811850_C_T",
              "r2Overall": 0.9795889901773936,
              "posteriorProbability": 0.10842199897114584,
              "standardError": 0.4903414892569359,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104809449_A_G",
              "r2Overall": 0.9788236748632788,
              "posteriorProbability": 0.10755433832212057,
              "standardError": 0.4840420793202839,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104923885_T_A",
              "r2Overall": 0.7593783865052643,
              "posteriorProbability": 0.019331632560989617,
              "standardError": 0.1155594911414945,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104917583_C_A",
              "r2Overall": 0.7429755287833241,
              "posteriorProbability": 0.016902978736043225,
              "standardError": 0.10982008303770788,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104893553_A_G",
              "r2Overall": 0.7374018023343303,
              "posteriorProbability": 0.01613856354775709,
              "standardError": 0.10802266150149473,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104983160_C_T",
              "r2Overall": 0.7317747077069402,
              "posteriorProbability": 0.015396457692484235,
              "standardError": 0.10627997455516276,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104909792_T_TG",
              "r2Overall": 0.7215257022773451,
              "posteriorProbability": 0.014118133921496271,
              "standardError": 0.10327971105902632,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105004990_G_A",
              "r2Overall": 0.7176504553770341,
              "posteriorProbability": 0.013658510098066918,
              "standardError": 0.10220033182371543,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105003706_A_G",
              "r2Overall": 0.7162613672489556,
              "posteriorProbability": 0.013496830850311928,
              "standardError": 0.10182044484784689,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105005110_A_C",
              "r2Overall": 0.7152710870024761,
              "posteriorProbability": 0.01338254802367906,
              "standardError": 0.10155184336716692,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104818360_T_TCC",
              "r2Overall": 0.7143035740495636,
              "posteriorProbability": 0.013271673883221494,
              "standardError": 0.10129118419176378,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104983614_G_T",
              "r2Overall": 0.7113637387412224,
              "posteriorProbability": 0.01293946964731965,
              "standardError": 0.10050972130074172,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105004289_T_C",
              "r2Overall": 0.7090054937053203,
              "posteriorProbability": 0.0126780268129202,
              "standardError": 0.0998941368660646,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104784458_G_A",
              "r2Overall": 0.7060542002125165,
              "posteriorProbability": 0.012357057263099151,
              "standardError": 0.09913756006055167,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105004446_A_G",
              "r2Overall": 0.6907440524517392,
              "posteriorProbability": 0.01079858291838451,
              "standardError": 0.09544525456730678,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105004435_A_C",
              "r2Overall": 0.6895495116069,
              "posteriorProbability": 0.010684218615155866,
              "standardError": 0.0951726935206498,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104978917_T_C",
              "r2Overall": 0.6869954261493064,
              "posteriorProbability": 0.01044307363933976,
              "standardError": 0.09459706971919302,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104985346_T_G",
              "r2Overall": 0.6866146426094216,
              "posteriorProbability": 0.010407513216332804,
              "standardError": 0.09451207603430097,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104987596_T_A",
              "r2Overall": 0.6864131871407867,
              "posteriorProbability": 0.010388740618103107,
              "standardError": 0.09446719553750992,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104984776_T_C",
              "r2Overall": 0.685717376712093,
              "posteriorProbability": 0.010324118368562214,
              "standardError": 0.09431263737609016,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104972212_G_A",
              "r2Overall": 0.6847672841403307,
              "posteriorProbability": 0.010236420965226884,
              "standardError": 0.09410273112821352,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105001858_C_T",
              "r2Overall": 0.680528758991628,
              "posteriorProbability": 0.009852705869235269,
              "standardError": 0.0931820116838496,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104769806_A_G",
              "r2Overall": 0.6800698753968681,
              "posteriorProbability": 0.00981189158201458,
              "standardError": 0.0930838464756536,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104995438_T_G",
              "r2Overall": 0.6773130035304364,
              "posteriorProbability": 0.009569640416090706,
              "standardError": 0.09250020484906432,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105006932_A_G",
              "r2Overall": 0.658642301196509,
              "posteriorProbability": 0.008056529159527346,
              "standardError": 0.08880814595608465,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105007752_G_T",
              "r2Overall": 0.6585371378272544,
              "posteriorProbability": 0.008048608918237062,
              "standardError": 0.08878856649707456,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105005610_C_T",
              "r2Overall": 0.6583592615271442,
              "posteriorProbability": 0.008035227169203293,
              "standardError": 0.08875547876933887,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105007399_T_C",
              "r2Overall": 0.6578410458618911,
              "posteriorProbability": 0.00799634713106631,
              "standardError": 0.08865929379082568,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105008104_T_C",
              "r2Overall": 0.656390871323264,
              "posteriorProbability": 0.007888377688853386,
              "standardError": 0.08839179128508458,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105006509_A_G",
              "r2Overall": 0.6555414425282524,
              "posteriorProbability": 0.0078257017514816,
              "standardError": 0.08823623263418881,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105006625_A_G",
              "r2Overall": 0.6522171245793837,
              "posteriorProbability": 0.007584390169340849,
              "standardError": 0.08763534599879765,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105008523_T_G",
              "r2Overall": 0.6508300548322212,
              "posteriorProbability": 0.007485554554707114,
              "standardError": 0.08738829890374579,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105008756_C_T",
              "r2Overall": 0.6479848735691478,
              "posteriorProbability": 0.007286179787520505,
              "standardError": 0.08688819254297334,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105005530_A_AGT",
              "r2Overall": 0.6404330327901777,
              "posteriorProbability": 0.0067783574642028745,
              "standardError": 0.08560284781134689,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105006640_G_A",
              "r2Overall": 0.6386822304900257,
              "posteriorProbability": 0.006664946315926764,
              "standardError": 0.08531332646459085,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104888352_C_A",
              "r2Overall": 0.5896004882612847,
              "posteriorProbability": 0.004071144762043806,
              "standardError": 0.07833084574583661,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104813736_A_G",
              "r2Overall": 0.5872478767607742,
              "posteriorProbability": 0.003972075378941542,
              "standardError": 0.07804486118542169,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104896379_C_T",
              "r2Overall": 0.5872444193912987,
              "posteriorProbability": 0.003971931296286102,
              "standardError": 0.07804444382138244,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104818087_C_A",
              "r2Overall": 0.5868942402560813,
              "posteriorProbability": 0.003957360695904003,
              "standardError": 0.07800221523198997,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104883976_T_TGG",
              "r2Overall": 0.5867892325398683,
              "posteriorProbability": 0.003953000217584305,
              "standardError": 0.07798956919593067,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104889936_G_T",
              "r2Overall": 0.5867179332475452,
              "posteriorProbability": 0.0039500418001554285,
              "standardError": 0.07798098711483434,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104883903_T_C",
              "r2Overall": 0.5864729734320387,
              "posteriorProbability": 0.003939891906767,
              "standardError": 0.07795152952160701,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104820013_G_T",
              "r2Overall": 0.5863365998910129,
              "posteriorProbability": 0.003934250807092772,
              "standardError": 0.07793514837882597,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104893377_T_C",
              "r2Overall": 0.5862031025203106,
              "posteriorProbability": 0.003928735273784389,
              "standardError": 0.07791912547431307,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104891621_C_T",
              "r2Overall": 0.5859596668738375,
              "posteriorProbability": 0.0039186943399293,
              "standardError": 0.07788993977199765,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104883033_C_G",
              "r2Overall": 0.5858241703588994,
              "posteriorProbability": 0.003913114920649165,
              "standardError": 0.07787371311786823,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104890184_G_A",
              "r2Overall": 0.5845061861074607,
              "posteriorProbability": 0.003859191884099656,
              "standardError": 0.07771654949124011,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104903494_C_T",
              "r2Overall": 0.5843521496657367,
              "posteriorProbability": 0.003852930830627651,
              "standardError": 0.07769826087124747,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104912930_A_C",
              "r2Overall": 0.5843499899112443,
              "posteriorProbability": 0.003852843104916416,
              "standardError": 0.07769800456331503,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104906154_T_C",
              "r2Overall": 0.5842579193567063,
              "posteriorProbability": 0.00384910491439337,
              "standardError": 0.07768708116158239,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104906388_C_T",
              "r2Overall": 0.5838696674444347,
              "posteriorProbability": 0.0038333749677495633,
              "standardError": 0.07764108341392567,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104973747_A_G",
              "r2Overall": 0.5836198612419288,
              "posteriorProbability": 0.003823282800289541,
              "standardError": 0.07761154343143814,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104908144_G_A",
              "r2Overall": 0.5825758584288102,
              "posteriorProbability": 0.003781347186145857,
              "standardError": 0.07748855750494678,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104907539_G_A",
              "r2Overall": 0.582517052487157,
              "posteriorProbability": 0.003778996649157151,
              "standardError": 0.07748165248621836,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104906040_C_T",
              "r2Overall": 0.5815194205471212,
              "posteriorProbability": 0.0037393075898541663,
              "standardError": 0.07736487343006179,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104903298_G_A",
              "r2Overall": 0.5814897540893867,
              "posteriorProbability": 0.0037381327653976926,
              "standardError": 0.07736141126712935,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104915237_A_G",
              "r2Overall": 0.5803639057990568,
              "posteriorProbability": 0.0036937774523071393,
              "standardError": 0.07723046682801293,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104910816_G_A",
              "r2Overall": 0.5797590871593173,
              "posteriorProbability": 0.003670133178092268,
              "standardError": 0.07716047897833067,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104882026_T_C",
              "r2Overall": 0.5782862382507684,
              "posteriorProbability": 0.0036130884538375704,
              "standardError": 0.07699108181233996,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104887216_G_A",
              "r2Overall": 0.5781933988920879,
              "posteriorProbability": 0.0036095179210996337,
              "standardError": 0.07698045306839908,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104897359_C_T",
              "r2Overall": 0.5781041486361528,
              "posteriorProbability": 0.003606088230873529,
              "standardError": 0.07697024068481767,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104886668_A_G",
              "r2Overall": 0.5777551208187656,
              "posteriorProbability": 0.00359270226304457,
              "standardError": 0.07693035482074045,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104916333_T_C",
              "r2Overall": 0.577131369693082,
              "posteriorProbability": 0.0035688845208030483,
              "standardError": 0.07685927759049271,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104882531_T_C",
              "r2Overall": 0.5767050821299932,
              "posteriorProbability": 0.0035526836649723034,
              "standardError": 0.07681085104125389,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104887727_C_G",
              "r2Overall": 0.5764206969843025,
              "posteriorProbability": 0.0035419103100233665,
              "standardError": 0.07677861199259453,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104890956_T_C",
              "r2Overall": 0.5763759150100899,
              "posteriorProbability": 0.003540216352344604,
              "standardError": 0.07677354022734381,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104887314_T_C",
              "r2Overall": 0.575629680447297,
              "posteriorProbability": 0.0035120892258550702,
              "standardError": 0.07668922150034145,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104891191_G_A",
              "r2Overall": 0.5755294846230872,
              "posteriorProbability": 0.003508327049333687,
              "standardError": 0.07667792822407456,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104893041_A_G",
              "r2Overall": 0.5748880607119907,
              "posteriorProbability": 0.0034843232612909456,
              "standardError": 0.07660578900871581,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104915827_C_T",
              "r2Overall": 0.5748519451805322,
              "posteriorProbability": 0.0034829758578476464,
              "standardError": 0.07660173525455796,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104896922_C_T",
              "r2Overall": 0.5745142268812939,
              "posteriorProbability": 0.0034703975016086865,
              "standardError": 0.0765638698865369,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104887349_G_GC",
              "r2Overall": 0.574398873789486,
              "posteriorProbability": 0.003466109964283945,
              "standardError": 0.07655095352888748,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104885640_T_C",
              "r2Overall": 0.5742510436425214,
              "posteriorProbability": 0.0034606218362313364,
              "standardError": 0.07653441340086284,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104888081_G_A",
              "r2Overall": 0.5732881019548031,
              "posteriorProbability": 0.0034250524045650317,
              "standardError": 0.07642702363035224,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104901625_G_A",
              "r2Overall": 0.5722343554257278,
              "posteriorProbability": 0.003386483279921847,
              "standardError": 0.07631019919401526,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104915027_A_T",
              "r2Overall": 0.5721440466269028,
              "posteriorProbability": 0.003383194953963415,
              "standardError": 0.07630022054005911,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104815507_G_A",
              "r2Overall": 0.5716589887401144,
              "posteriorProbability": 0.00336557915439297,
              "standardError": 0.07624671434721715,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104901834_G_A",
              "r2Overall": 0.5716144284085234,
              "posteriorProbability": 0.003363964756977085,
              "standardError": 0.07624180656347465,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104906597_C_T",
              "r2Overall": 0.5713339538736727,
              "posteriorProbability": 0.0033538183314717174,
              "standardError": 0.07621094504434342,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104781766_A_G",
              "r2Overall": 0.5710422437534075,
              "posteriorProbability": 0.0033432929069321556,
              "standardError": 0.07617890094581156,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104907624_C_T",
              "r2Overall": 0.570974452776561,
              "posteriorProbability": 0.0033408508899389617,
              "standardError": 0.07617146199852029,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104905346_CTGTGTTGGAAAACACCA_C",
              "r2Overall": 0.5696746088448772,
              "posteriorProbability": 0.003294317781895555,
              "standardError": 0.07602939474562614,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104909270_T_C",
              "r2Overall": 0.5688918666187753,
              "posteriorProbability": 0.003266561708972238,
              "standardError": 0.07594436414023215,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104914273_G_A",
              "r2Overall": 0.5685129841349901,
              "posteriorProbability": 0.00325319772711206,
              "standardError": 0.0759033450936723,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104799529_C_T",
              "r2Overall": 0.5684158925002367,
              "posteriorProbability": 0.003249780555128988,
              "standardError": 0.07589284825777205,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104773928_G_C",
              "r2Overall": 0.5682673235033627,
              "posteriorProbability": 0.0032445574985977897,
              "standardError": 0.07587679759771984,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104791186_G_A",
              "r2Overall": 0.5682220285945246,
              "posteriorProbability": 0.0032429665347290452,
              "standardError": 0.07587190693224251,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104918248_A_G",
              "r2Overall": 0.5680726650711782,
              "posteriorProbability": 0.003237724881753636,
              "standardError": 0.07585578875202899,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104918195_A_C",
              "r2Overall": 0.5679312936278197,
              "posteriorProbability": 0.003232770301019112,
              "standardError": 0.07584054597595741,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104918156_T_C",
              "r2Overall": 0.5676362473539007,
              "posteriorProbability": 0.003222450608350638,
              "standardError": 0.07580877441326923,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104904788_TTA_T",
              "r2Overall": 0.566486578663389,
              "posteriorProbability": 0.0031825046703460548,
              "standardError": 0.07568549561615216,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104773897_G_A",
              "r2Overall": 0.5660610940974053,
              "posteriorProbability": 0.0031678275861634366,
              "standardError": 0.07564008052536625,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104918317_A_C",
              "r2Overall": 0.5659961325635736,
              "posteriorProbability": 0.0031655917880341468,
              "standardError": 0.07563315663205018,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104914358_C_T",
              "r2Overall": 0.5658266472699947,
              "posteriorProbability": 0.003159764855279717,
              "standardError": 0.07561510449003746,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104784635_C_G",
              "r2Overall": 0.5657894133939884,
              "posteriorProbability": 0.0031584859654150473,
              "standardError": 0.07561114104589109,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104922777_A_AG",
              "r2Overall": 0.5652801737323861,
              "posteriorProbability": 0.0031410387908423643,
              "standardError": 0.07555702030093514,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104778128_C_T",
              "r2Overall": 0.5642045436226849,
              "posteriorProbability": 0.0031044544034533146,
              "standardError": 0.07544323260737015,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104888079_T_A",
              "r2Overall": 0.5634535225547199,
              "posteriorProbability": 0.0030791250922719555,
              "standardError": 0.07536420690475842,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104799101_G_A",
              "r2Overall": 0.5628538842327377,
              "posteriorProbability": 0.00305902725186012,
              "standardError": 0.0753013585847419,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104937698_A_G",
              "r2Overall": 0.5623543740536644,
              "posteriorProbability": 0.003042370302115533,
              "standardError": 0.07524917237075572,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104888553_C_CT",
              "r2Overall": 0.5605539910902547,
              "posteriorProbability": 0.002982969734227546,
              "standardError": 0.07506233454710044,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104939454_G_A",
              "r2Overall": 0.5589871498833051,
              "posteriorProbability": 0.0029320772105861617,
              "standardError": 0.07490132164104144,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104888041_GT_G",
              "r2Overall": 0.5584016132705196,
              "posteriorProbability": 0.002913248306739154,
              "standardError": 0.07484152674589373,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104790342_AAGTC_A",
              "r2Overall": 0.5560774295101472,
              "posteriorProbability": 0.0028395180612834367,
              "standardError": 0.07460618323353083,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104800244_CAT_C",
              "r2Overall": 0.5543710087232805,
              "posteriorProbability": 0.0027863983985885908,
              "standardError": 0.07443541033907396,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_105016935_G_A",
              "r2Overall": 0.5275255811885694,
              "posteriorProbability": 0.002055290402702999,
              "standardError": 0.07196025294622156,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104799682_C_CT",
              "r2Overall": 0.5269040145152775,
              "posteriorProbability": 0.0020405234723681106,
              "standardError": 0.07190739030167738,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104766976_A_T",
              "r2Overall": 0.5262250731617519,
              "posteriorProbability": 0.0020244971473784763,
              "standardError": 0.07184986561133075,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104766362_G_A",
              "r2Overall": 0.5255816476812185,
              "posteriorProbability": 0.0020094085721420255,
              "standardError": 0.07179555890279833,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104746525_G_A",
              "r2Overall": 0.5163169552203275,
              "posteriorProbability": 0.0018025741867140784,
              "standardError": 0.07103567569967428,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104749568_C_T",
              "r2Overall": 0.5153780938679623,
              "posteriorProbability": 0.0017826708208202953,
              "standardError": 0.07096092812147983,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104762734_C_G",
              "r2Overall": 0.5149116942549686,
              "posteriorProbability": 0.0017728536172475111,
              "standardError": 0.07092394697214081,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_104769693_C_T",
              "r2Overall": 0.5138979663859903,
              "posteriorProbability": 0.0017516754526396222,
              "standardError": 0.0708439126300278,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_110187517_G_T",
          "study.id": "GCST005973",
          "study.traitFromSource": "White blood cell count",
          "study.disease.id": "EFO_0004308",
          "study.disease.name": "White blood cell count",
          "pValueMantissa": 7.0,
          "pValueExponent": -10,
          "beta": 0.02789,
          "ldPopulationStructure": [
            {
              "ldPopulation": "eas",
              "relativeSampleSize": 1.0
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.18984346091747284,
          "l2g.target.id": "ENSG00000108055",
          "l2g.target.approvedSymbol": "SMC3",
          "locus": [
            {
              "variantId": "10_110187517_G_T",
              "r2Overall": 0.9999999999999964,
              "posteriorProbability": 0.21382838651138103,
              "standardError": 0.9999996293042028,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110187115_A_G",
              "r2Overall": 0.992509941200696,
              "posteriorProbability": 0.1643858013674348,
              "standardError": 0.5844523164624857,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110184648_G_A",
              "r2Overall": 0.9793455518224148,
              "posteriorProbability": 0.13319406827910185,
              "standardError": 0.41254407306602825,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110180675_G_A",
              "r2Overall": 0.9612293905773184,
              "posteriorProbability": 0.10609495085526335,
              "standardError": 0.3009086373359558,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110181613_G_A",
              "r2Overall": 0.9571279166932668,
              "posteriorProbability": 0.10118684882772525,
              "standardError": 0.2836554581040648,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110186449_G_A",
              "r2Overall": 0.8915019312555382,
              "posteriorProbability": 0.050558165701946114,
              "standardError": 0.14488395869063828,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110183935_C_CTTT",
              "r2Overall": 0.8568955378433095,
              "posteriorProbability": 0.03539029929802225,
              "standardError": 0.11357698853424228,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110174765_C_T",
              "r2Overall": 0.8473369209357036,
              "posteriorProbability": 0.032032439451335964,
              "standardError": 0.1070492764494751,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110176305_G_A",
              "r2Overall": 0.8315130610314413,
              "posteriorProbability": 0.02711241814761843,
              "standardError": 0.09767211515161808,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110175650_G_A",
              "r2Overall": 0.8215841190391298,
              "posteriorProbability": 0.024387574927609738,
              "standardError": 0.09254901569132842,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110175646_G_C",
              "r2Overall": 0.816906722845756,
              "posteriorProbability": 0.023191737694017302,
              "standardError": 0.090310707038578,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110198526_T_C",
              "r2Overall": 0.7995919574754828,
              "posteriorProbability": 0.019208527102838845,
              "standardError": 0.08286919060157737,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110198704_G_C",
              "r2Overall": 0.7995919574754828,
              "posteriorProbability": 0.019208527102838845,
              "standardError": 0.08286919060157737,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110192770_A_T",
              "r2Overall": 0.7956508931611581,
              "posteriorProbability": 0.01839203943492685,
              "standardError": 0.0813410424343559,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110194112_G_C",
              "r2Overall": 0.7847883011551379,
              "posteriorProbability": 0.0162985541646602,
              "standardError": 0.07740616738461278,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110187269_C_CT",
              "r2Overall": 0.7040869317653166,
              "posteriorProbability": 0.006253047078584503,
              "standardError": 0.057203570267523075,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_110228667_TA_T",
          "study.id": "GCST90018979",
          "study.traitFromSource": "Serum creatinine levels",
          "study.disease.id": "EFO_0004518",
          "study.disease.name": "Serum creatinine levels",
          "pValueMantissa": 1.0,
          "pValueExponent": -12,
          "beta": 0.0173,
          "ldPopulationStructure": [
            {
              "ldPopulation": "eas",
              "relativeSampleSize": 0.30395452798511235
            },
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 0.6960454720148876
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.42782676219940186,
          "l2g.target.id": "ENSG00000119950",
          "l2g.target.approvedSymbol": "MXI1",
          "locus": [
            {
              "variantId": "10_110228667_TA_T",
              "r2Overall": 1.0000000000000016,
              "posteriorProbability": 0.10904142941607622,
              "standardError": 0.9999997409562176,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110229328_G_T",
              "r2Overall": 0.9753905212320588,
              "posteriorProbability": 0.05866135086390357,
              "standardError": 0.3315139959798031,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110246728_G_A",
              "r2Overall": 0.9751977889883988,
              "posteriorProbability": 0.058483499050211295,
              "standardError": 0.33012567761081657,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110242412_C_G",
              "r2Overall": 0.9727345778320065,
              "posteriorProbability": 0.05628686039666636,
              "standardError": 0.3133520400134764,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110228820_T_G",
              "r2Overall": 0.9720634041078268,
              "posteriorProbability": 0.0557114742648197,
              "standardError": 0.30907021892108133,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110233939_G_C",
              "r2Overall": 0.9712629193524872,
              "posteriorProbability": 0.05503734509903156,
              "standardError": 0.3041112468387191,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110219441_C_T",
              "r2Overall": 0.9702801105942848,
              "posteriorProbability": 0.054226984568349214,
              "standardError": 0.29823130753269067,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110229567_G_A",
              "r2Overall": 0.969771016211094,
              "posteriorProbability": 0.05381445168736717,
              "standardError": 0.2952715757975185,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110245789_A_G",
              "r2Overall": 0.9694058494988532,
              "posteriorProbability": 0.05352150092149889,
              "standardError": 0.29318340446089064,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110254249_T_C",
              "r2Overall": 0.9693886760416864,
              "posteriorProbability": 0.053507783637913635,
              "standardError": 0.29308590251885114,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110220011_C_T",
              "r2Overall": 0.969363145197594,
              "posteriorProbability": 0.05348740078754086,
              "standardError": 0.2929410674264232,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110232464_T_C",
              "r2Overall": 0.968116521476256,
              "posteriorProbability": 0.052506253922787245,
              "standardError": 0.28603310003626653,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110232125_T_C",
              "r2Overall": 0.9659657954374424,
              "posteriorProbability": 0.05087541002648655,
              "standardError": 0.274822314601476,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110222177_C_A",
              "r2Overall": 0.9650567749412582,
              "posteriorProbability": 0.05020828627951818,
              "standardError": 0.27033183391103793,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110232866_G_C",
              "r2Overall": 0.9624154392014952,
              "posteriorProbability": 0.04833908950349664,
              "standardError": 0.25803675541127,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110267898_A_G",
              "r2Overall": 0.9553096713128304,
              "posteriorProbability": 0.043760653797175725,
              "standardError": 0.22961832920310865,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110242864_GTCTGCTCT_G",
              "r2Overall": 0.9486140895928724,
              "posteriorProbability": 0.039948687370387335,
              "standardError": 0.207665094906735,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110250913_A_C",
              "r2Overall": 0.930745664471338,
              "posteriorProbability": 0.03156799477924517,
              "standardError": 0.1642113339983024,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110248873_G_A",
              "r2Overall": 0.8457621453809188,
              "posteriorProbability": 0.010592303814947902,
              "standardError": 0.07660798925680033,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_110226049_T_TGGGGCGGCA",
              "r2Overall": 0.8200166662679897,
              "posteriorProbability": 0.00751790213945574,
              "standardError": 0.06493802124740589,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_112143069_C_T",
          "study.id": "GCST90002398",
          "study.traitFromSource": "Neutrophil count",
          "study.disease.id": "EFO_0004833",
          "study.disease.name": "Neutrophil count",
          "pValueMantissa": 7.0,
          "pValueExponent": -10,
          "beta": -0.015831053,
          "ldPopulationStructure": [
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 1.0
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.9894821643829346,
          "l2g.target.id": "ENSG00000119927",
          "l2g.target.approvedSymbol": "GPAM",
          "locus": [
            {
              "variantId": "10_112143069_C_T",
              "r2Overall": 0.9999999999999948,
              "posteriorProbability": 0.17547340310158824,
              "standardError": 0.9999995445109736,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112141879_T_C",
              "r2Overall": 0.9715465309306232,
              "posteriorProbability": 0.09864108994945138,
              "standardError": 0.35531998463032866,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112142696_C_T",
              "r2Overall": 0.970674428326376,
              "posteriorProbability": 0.09756677839888588,
              "standardError": 0.3499495884740611,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112142660_A_C",
              "r2Overall": 0.96962880142279,
              "posteriorProbability": 0.09630496478710532,
              "standardError": 0.3437292065606653,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112141436_C_T",
              "r2Overall": 0.967473957700291,
              "posteriorProbability": 0.09378940010045432,
              "standardError": 0.33160371905892416,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112150963_A_G",
              "r2Overall": 0.8055229203544088,
              "posteriorProbability": 0.016821292629568003,
              "standardError": 0.08527895195949671,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112157077_A_C",
              "r2Overall": 0.8044296223881932,
              "posteriorProbability": 0.016621588058421597,
              "standardError": 0.08482442504095188,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112157327_T_A",
              "r2Overall": 0.8044094561647446,
              "posteriorProbability": 0.016617924386806482,
              "standardError": 0.08481608586906757,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112161401_T_A",
              "r2Overall": 0.8040486116942707,
              "posteriorProbability": 0.016552490006854215,
              "standardError": 0.08466714089982955,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112176486_A_C",
              "r2Overall": 0.8028229106516992,
              "posteriorProbability": 0.01633193626792239,
              "standardError": 0.0841650325437894,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112158075_T_C",
              "r2Overall": 0.7994380748068595,
              "posteriorProbability": 0.015736391812850557,
              "standardError": 0.0828084557193631,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112161596_G_A",
              "r2Overall": 0.7990043119586504,
              "posteriorProbability": 0.015661487324548747,
              "standardError": 0.08263773013896912,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112174626_G_C",
              "r2Overall": 0.7969849805192458,
              "posteriorProbability": 0.015316932767366596,
              "standardError": 0.08185203388315539,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112162970_A_G",
              "r2Overall": 0.7954436892691514,
              "posteriorProbability": 0.015058492774487784,
              "standardError": 0.08126224631158563,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112180571_T_C",
              "r2Overall": 0.7951928401632228,
              "posteriorProbability": 0.015016799264622868,
              "standardError": 0.08116705568221051,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112174128_A_G",
              "r2Overall": 0.79459057749023,
              "posteriorProbability": 0.01491711533752147,
              "standardError": 0.08093941670284807,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112177097_C_T",
              "r2Overall": 0.7945203931438332,
              "posteriorProbability": 0.01490553700317328,
              "standardError": 0.08091297162436499,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112187920_A_G",
              "r2Overall": 0.7938762933026488,
              "posteriorProbability": 0.014799651301498682,
              "standardError": 0.08067108012135012,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112179826_G_A",
              "r2Overall": 0.7933702697684132,
              "posteriorProbability": 0.014716932847838735,
              "standardError": 0.08048205227443717,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112184513_A_G",
              "r2Overall": 0.7932221985061793,
              "posteriorProbability": 0.0146928056443013,
              "standardError": 0.08042690648111626,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112156544_T_C",
              "r2Overall": 0.7927898848106879,
              "posteriorProbability": 0.014622563580601483,
              "standardError": 0.08026633179293742,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112189906_T_C",
              "r2Overall": 0.7909412340633724,
              "posteriorProbability": 0.01432554119434703,
              "standardError": 0.07958685283185342,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112187282_C_T",
              "r2Overall": 0.790862006326526,
              "posteriorProbability": 0.014312932007802651,
              "standardError": 0.07955798945697608,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112178183_G_T",
              "r2Overall": 0.7901905463552931,
              "posteriorProbability": 0.01420646235039568,
              "standardError": 0.07931420995900075,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112185182_T_A",
              "r2Overall": 0.7897422876423252,
              "posteriorProbability": 0.014135775374896494,
              "standardError": 0.07915229739194675,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112178573_AAAAC_A",
              "r2Overall": 0.7876352237822429,
              "posteriorProbability": 0.013807660525298918,
              "standardError": 0.07840002404726906,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112174102_G_GGTGACAACTAT",
              "r2Overall": 0.7860800763438279,
              "posteriorProbability": 0.013569830143096408,
              "standardError": 0.07785395777419524,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112190660_T_C",
              "r2Overall": 0.784577183608911,
              "posteriorProbability": 0.013343439107617733,
              "standardError": 0.07733347803296452,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112153464_T_C",
              "r2Overall": 0.7792010807872889,
              "posteriorProbability": 0.012560656781168508,
              "standardError": 0.0755279446868394,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112162067_G_A",
              "r2Overall": 0.7775568013952708,
              "posteriorProbability": 0.012329476447519527,
              "standardError": 0.07499271366414799,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112171932_C_T",
              "r2Overall": 0.776638585487189,
              "posteriorProbability": 0.012202017122824245,
              "standardError": 0.07469718031242839,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112153794_A_T",
              "r2Overall": 0.7760339724816284,
              "posteriorProbability": 0.012118724891038449,
              "standardError": 0.07450387900191571,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112159367_G_T",
              "r2Overall": 0.7750867581850964,
              "posteriorProbability": 0.01198924223982153,
              "standardError": 0.07420309521273556,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112159366_A_G",
              "r2Overall": 0.7744036955031169,
              "posteriorProbability": 0.011896626325147194,
              "standardError": 0.073987731870384,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112173249_ATT_A",
              "r2Overall": 0.7709373926538112,
              "posteriorProbability": 0.01143627164739054,
              "standardError": 0.07291434481398387,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_112421336_G_A",
          "study.id": "GCST90105038",
          "study.traitFromSource": "Educational attainment",
          "study.disease.id": "EFO_0011015",
          "study.disease.name": "Educational attainment",
          "pValueMantissa": 2.0,
          "pValueExponent": -8,
          "beta": 0.0058636,
          "ldPopulationStructure": [
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 1.0
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.2971999943256378,
          "l2g.target.id": "ENSG00000197142",
          "l2g.target.approvedSymbol": "ACSL5",
          "locus": [
            {
              "variantId": "10_112421336_G_A",
              "r2Overall": 1.0000000000000036,
              "posteriorProbability": 0.0914850895678706,
              "standardError": 0.9999996600561928,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112404388_T_G",
              "r2Overall": 0.9157780477320668,
              "posteriorProbability": 0.03160015718180826,
              "standardError": 0.2054778568246372,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112415196_T_G",
              "r2Overall": 0.915705525321206,
              "posteriorProbability": 0.031579361175074,
              "standardError": 0.20535123092261728,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112412889_T_TG",
              "r2Overall": 0.9141307236266334,
              "posteriorProbability": 0.03113150894862756,
              "standardError": 0.20263796467151515,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112404318_C_G",
              "r2Overall": 0.9133443872576252,
              "posteriorProbability": 0.030910519161944237,
              "standardError": 0.20130869253641817,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112413894_A_G",
              "r2Overall": 0.9122325922269228,
              "posteriorProbability": 0.03060100379233999,
              "standardError": 0.19945746140965917,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112414673_A_C",
              "r2Overall": 0.9102456691974168,
              "posteriorProbability": 0.030056271252433087,
              "standardError": 0.19622890213993285,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112401398_G_A",
              "r2Overall": 0.9074174384984468,
              "posteriorProbability": 0.029298954396432292,
              "standardError": 0.1918019242431288,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112401104_C_T",
              "r2Overall": 0.9069490284596232,
              "posteriorProbability": 0.02917552446477322,
              "standardError": 0.19108708727877272,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112405565_A_G",
              "r2Overall": 0.905465415036155,
              "posteriorProbability": 0.028788239512746765,
              "standardError": 0.18885615573590017,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112400054_G_C",
              "r2Overall": 0.8994842272112163,
              "posteriorProbability": 0.027281287680552053,
              "standardError": 0.1803450724668465,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112391999_T_C",
              "r2Overall": 0.8991549357596843,
              "posteriorProbability": 0.02720076606945395,
              "standardError": 0.1798977322090649,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112399694_G_A",
              "r2Overall": 0.8989391484158045,
              "posteriorProbability": 0.02714813389252352,
              "standardError": 0.1796057329847719,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112400002_C_T",
              "r2Overall": 0.8989007336792152,
              "posteriorProbability": 0.0271387753656371,
              "standardError": 0.17955384570146465,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112394052_GC_G",
              "r2Overall": 0.8968398517154305,
              "posteriorProbability": 0.02664158442786566,
              "standardError": 0.17681150606543836,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112399150_A_G",
              "r2Overall": 0.8967765914804876,
              "posteriorProbability": 0.02662647286984378,
              "standardError": 0.17672859210677053,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112400726_T_A",
              "r2Overall": 0.8954266312862698,
              "posteriorProbability": 0.026306094423684857,
              "standardError": 0.17497674434938654,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112391904_T_C",
              "r2Overall": 0.8944414764637836,
              "posteriorProbability": 0.026074798579585477,
              "standardError": 0.17371908466458877,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112389721_C_A",
              "r2Overall": 0.8917873099020169,
              "posteriorProbability": 0.025461951951390407,
              "standardError": 0.17041508143189826,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112400629_A_G",
              "r2Overall": 0.8902521581856492,
              "posteriorProbability": 0.02511419924957248,
              "standardError": 0.1685582971447215,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112387276_T_C",
              "r2Overall": 0.8855232929272691,
              "posteriorProbability": 0.02407281169511628,
              "standardError": 0.1630741823584493,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112388931_C_T",
              "r2Overall": 0.8846598984169664,
              "posteriorProbability": 0.023887401451363977,
              "standardError": 0.1621095416664964,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112389547_T_C",
              "r2Overall": 0.8835410099541556,
              "posteriorProbability": 0.02364923957302673,
              "standardError": 0.1608755681557727,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112386459_G_T",
              "r2Overall": 0.8820640914223177,
              "posteriorProbability": 0.02333847586375916,
              "standardError": 0.1592740039493438,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112390103_AAG_A",
              "r2Overall": 0.8799337868067444,
              "posteriorProbability": 0.02289733216782497,
              "standardError": 0.15701697118281294,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112384081_G_T",
              "r2Overall": 0.8762673087118487,
              "posteriorProbability": 0.02215719278361061,
              "standardError": 0.15327271652498797,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112384305_GTT_G",
              "r2Overall": 0.8742986796475348,
              "posteriorProbability": 0.021769489018271013,
              "standardError": 0.15133219864877534,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112382302_T_C",
              "r2Overall": 0.8669325531393693,
              "posteriorProbability": 0.02037617824424123,
              "standardError": 0.14447236255104798,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112382641_T_C",
              "r2Overall": 0.8657558168787384,
              "posteriorProbability": 0.02016168391530864,
              "standardError": 0.143431672996855,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112383049_G_A",
              "r2Overall": 0.8645288415808422,
              "posteriorProbability": 0.01994032607461161,
              "standardError": 0.14236185362546488,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112378914_G_A",
              "r2Overall": 0.8623682429668296,
              "posteriorProbability": 0.0195561402402726,
              "standardError": 0.14051500827374594,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112379256_C_T",
              "r2Overall": 0.8612133422989573,
              "posteriorProbability": 0.0193536710782685,
              "standardError": 0.13954669985850324,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112378485_T_G",
              "r2Overall": 0.8550352152085946,
              "posteriorProbability": 0.018303701316122977,
              "standardError": 0.13457891276901998,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112376591_G_C",
              "r2Overall": 0.8517525744677119,
              "posteriorProbability": 0.017767770669465506,
              "standardError": 0.13207676700423804,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112383813_C_CTT",
              "r2Overall": 0.8188476268252689,
              "posteriorProbability": 0.013136896614150809,
              "standardError": 0.1112724272958476,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112401948_T_TTC",
              "r2Overall": 0.7878935812551772,
              "posteriorProbability": 0.00980021035187372,
              "standardError": 0.0969405159876256,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112400383_A_AT",
              "r2Overall": 0.7832245555626098,
              "posteriorProbability": 0.009367921863860314,
              "standardError": 0.09510359898998703,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112351590_G_C",
              "r2Overall": 0.6842349854444824,
              "posteriorProbability": 0.003351353022560039,
              "standardError": 0.06866224468592941,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112397170_CTT_C",
              "r2Overall": 0.6720604012428834,
              "posteriorProbability": 0.0029212805237730792,
              "standardError": 0.06654004196739123,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112347540_T_C",
              "r2Overall": 0.6200892920833866,
              "posteriorProbability": 0.0015747729015694932,
              "standardError": 0.05917436074187996,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112346603_G_A",
              "r2Overall": 0.6093936465029486,
              "posteriorProbability": 0.0013773676174158177,
              "standardError": 0.05793885603690751,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112445631_G_A",
              "r2Overall": 0.6059798155854008,
              "posteriorProbability": 0.0013190499833366106,
              "standardError": 0.05756152626537609,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112346842_A_AG",
              "r2Overall": 0.60361514027492,
              "posteriorProbability": 0.0012799202893634192,
              "standardError": 0.05730480059271405,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112438224_A_T",
              "r2Overall": 0.5992762887491275,
              "posteriorProbability": 0.0012107344609532064,
              "standardError": 0.05684339155392561,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112343866_A_C",
              "r2Overall": 0.59923547558116,
              "posteriorProbability": 0.001210099389302165,
              "standardError": 0.05683910969220892,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112443784_A_G",
              "r2Overall": 0.5978469318537155,
              "posteriorProbability": 0.001188664483998061,
              "standardError": 0.05669407169221633,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112437884_T_C",
              "r2Overall": 0.5963755409899383,
              "posteriorProbability": 0.001166310986917547,
              "standardError": 0.0565417264206859,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112343745_A_G",
              "r2Overall": 0.5963019512514425,
              "posteriorProbability": 0.0011652026521231902,
              "standardError": 0.05653414319648064,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112442461_C_T",
              "r2Overall": 0.5961647033452381,
              "posteriorProbability": 0.0011631380043541232,
              "standardError": 0.056520009329657506,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112440597_G_A",
              "r2Overall": 0.5960198872619116,
              "posteriorProbability": 0.0011609629509471084,
              "standardError": 0.05650510900726737,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112407983_A_G",
              "r2Overall": 0.5949325492173843,
              "posteriorProbability": 0.001144744245494961,
              "standardError": 0.05639365374433747,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112348992_T_G",
              "r2Overall": 0.588403940409203,
              "posteriorProbability": 0.001051438559685371,
              "standardError": 0.05573985316176118,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112313194_G_A",
              "r2Overall": 0.5817548184905585,
              "posteriorProbability": 0.000963277397159342,
              "standardError": 0.055100256536971016,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112312974_T_C",
              "r2Overall": 0.5799613180539651,
              "posteriorProbability": 0.0009406286468311034,
              "standardError": 0.05493212357548511,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112313150_T_G",
              "r2Overall": 0.5776736227440518,
              "posteriorProbability": 0.0009124130489785116,
              "standardError": 0.05472030349658488,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112315606_G_A",
              "r2Overall": 0.5765024805851728,
              "posteriorProbability": 0.0008982561044063833,
              "standardError": 0.05461299895362277,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112311590_A_G",
              "r2Overall": 0.5764347935870592,
              "posteriorProbability": 0.0008974437772935903,
              "standardError": 0.05460682047528192,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112312386_C_A",
              "r2Overall": 0.5761746054917942,
              "posteriorProbability": 0.0008943271573655799,
              "standardError": 0.05458309406067172,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112311889_T_C",
              "r2Overall": 0.568119790935268,
              "posteriorProbability": 0.0008023953580113004,
              "standardError": 0.05386676197216059,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112311316_A_G",
              "r2Overall": 0.5665659833873364,
              "posteriorProbability": 0.0007856436820106228,
              "standardError": 0.05373254473483084,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112311310_G_T",
              "r2Overall": 0.5662369045168626,
              "posteriorProbability": 0.0007821353146414384,
              "standardError": 0.053704280095355945,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112311873_A_G",
              "r2Overall": 0.5620508479619144,
              "posteriorProbability": 0.0007386863999086043,
              "standardError": 0.053349587535793705,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_112996282_A_T",
          "study.id": "GCST004045",
          "study.traitFromSource": "Age-related diseases, mortality and associated endophenotypes",
          "study.disease.id": "MONDO_0004992",
          "study.disease.name": "Age-related diseases, mortality and associated endophenotypes",
          "pValueMantissa": 8.0,
          "pValueExponent": -17,
          "ldPopulationStructure": [
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 1.0
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.8394678831100464,
          "l2g.target.id": "ENSG00000148737",
          "l2g.target.approvedSymbol": "TCF7L2",
          "locus": [
            {
              "variantId": "10_112996282_A_T",
              "r2Overall": 1.0000000000000029,
              "posteriorProbability": 0.4029927157763653,
              "standardError": 0.9999995757041636,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112994329_T_C",
              "r2Overall": 0.9707774131222062,
              "posteriorProbability": 0.17562899693846745,
              "standardError": 0.2491025576753398,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_113008012_G_A",
              "r2Overall": 0.9395266293218466,
              "posteriorProbability": 0.1023528654104906,
              "standardError": 0.14017068551850223,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_113005988_C_A",
              "r2Overall": 0.938229619080499,
              "posteriorProbability": 0.1001872812653022,
              "standardError": 0.13746141282226348,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_113014167_C_T",
              "r2Overall": 0.9154292431385568,
              "posteriorProbability": 0.06911525298359467,
              "standardError": 0.1010250179609704,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112994312_T_C",
              "r2Overall": 0.8762014830654911,
              "posteriorProbability": 0.03656151148379101,
              "standardError": 0.06636656223848664,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112998590_C_T",
              "r2Overall": 0.8737464941534318,
              "posteriorProbability": 0.03511775304914723,
              "standardError": 0.0648618949996448,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112995025_T_C",
              "r2Overall": 0.873263420085141,
              "posteriorProbability": 0.03484012179106452,
              "standardError": 0.06457238793340929,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_113014674_A_C",
              "r2Overall": 0.8054384767433959,
              "posteriorProbability": 0.0109591071572865,
              "standardError": 0.03819927676639047,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_113022823_G_GCT",
              "r2Overall": 0.801895216121032,
              "posteriorProbability": 0.010287318440272263,
              "standardError": 0.037337245730191086,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_113025665_G_A",
              "r2Overall": 0.8010629096051324,
              "posteriorProbability": 0.010135104710819864,
              "standardError": 0.03713963091817537,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_113016064_AT_A",
              "r2Overall": 0.7298811547114175,
              "posteriorProbability": 0.0026291619177670924,
              "standardError": 0.025209465706531372,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_112998590_C_T",
          "study.id": "GCST008025",
          "study.traitFromSource": "Body mass index",
          "study.disease.id": "EFO_0004340",
          "study.disease.name": "Body mass index",
          "pValueMantissa": 1.0,
          "pValueExponent": -6,
          "beta": -0.03582819,
          "ldPopulationStructure": [
            {
              "ldPopulation": "eas",
              "relativeSampleSize": 0.17395710868772044
            },
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 0.02077674626018567
            },
            {
              "ldPopulation": "afr",
              "relativeSampleSize": 0.34716422751043907
            },
            {
              "ldPopulation": "amr",
              "relativeSampleSize": 0.45810191754165486
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.958153486251831,
          "l2g.target.id": "ENSG00000148737",
          "l2g.target.approvedSymbol": "TCF7L2",
          "locus": [
            {
              "variantId": "10_112998590_C_T",
              "r2Overall": 1.0000000000000004,
              "posteriorProbability": 0.5404330063406425,
              "standardError": 0.9999998970664304,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112994312_T_C",
              "r2Overall": 0.9034428115355232,
              "posteriorProbability": 0.19949618152900328,
              "standardError": 0.2264181578019122,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112995025_T_C",
              "r2Overall": 0.9014048211180764,
              "posteriorProbability": 0.19649249795045065,
              "standardError": 0.2233007389680028,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112996282_A_T",
              "r2Overall": 0.6090415531441208,
              "posteriorProbability": 0.017159427108788046,
              "standardError": 0.08085322666682908,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112994329_T_C",
              "r2Overall": 0.6027148727349032,
              "posteriorProbability": 0.01608955924711223,
              "standardError": 0.08000013823678431,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112990741_A_G",
              "r2Overall": 0.5226906541289905,
              "posteriorProbability": 0.0067045170000939345,
              "standardError": 0.07155403954661615,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112993500_T_C",
              "r2Overall": 0.5178808537234586,
              "posteriorProbability": 0.0063364945721999565,
              "standardError": 0.07116109445969855,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112989975_G_A",
              "r2Overall": 0.5136680309442592,
              "posteriorProbability": 0.006028500305463472,
              "standardError": 0.070825824618156,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_112990477_T_C",
              "r2Overall": 0.512492761473134,
              "posteriorProbability": 0.005944902915558893,
              "standardError": 0.07073374794853193,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_114022302_G_A",
          "study.id": "GCST010321",
          "study.traitFromSource": "PR interval",
          "study.disease.id": "EFO_0004462",
          "study.disease.name": "PR interval",
          "pValueMantissa": 2.0,
          "pValueExponent": -10,
          "beta": -0.67,
          "ldPopulationStructure": [
            {
              "ldPopulation": "nfe",
              "relativeSampleSize": 0.9282349965477876
            },
            {
              "ldPopulation": "amr",
              "relativeSampleSize": 0.04382942652256243
            },
            {
              "ldPopulation": "afr",
              "relativeSampleSize": 0.027935576929650065
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.05827823281288147,
          "l2g.target.id": "ENSG00000197893",
          "l2g.target.approvedSymbol": "NRAP",
          "locus": [
            {
              "variantId": "10_114022302_G_A",
              "r2Overall": 1.000000000000007,
              "posteriorProbability": 0.16988431497699794,
              "standardError": 0.9999994604041728,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114022512_A_G",
              "r2Overall": 0.9889928725510746,
              "posteriorProbability": 0.12116597274791892,
              "standardError": 0.5122987722556271,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114023707_T_C",
              "r2Overall": 0.988540584619731,
              "posteriorProbability": 0.1202084167825612,
              "standardError": 0.5054630918702266,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114022665_C_G",
              "r2Overall": 0.9873643988915284,
              "posteriorProbability": 0.11781218984766896,
              "standardError": 0.48871561629985744,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114022608_T_C",
              "r2Overall": 0.9863603263147276,
              "posteriorProbability": 0.1158633228955928,
              "standardError": 0.4754633342429315,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114022609_G_A",
              "r2Overall": 0.985986049731182,
              "posteriorProbability": 0.11515756506814034,
              "standardError": 0.47074384957849286,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114022143_G_T",
              "r2Overall": 0.9732305743604086,
              "posteriorProbability": 0.09566997794819349,
              "standardError": 0.3555795107959844,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114024073_T_C",
              "r2Overall": 0.9710655066101722,
              "posteriorProbability": 0.09297657762081224,
              "standardError": 0.3417356180981286,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114040889_T_TAAA",
              "r2Overall": 0.6673555802203959,
              "posteriorProbability": 0.0025518178383123905,
              "standardError": 0.04713292903794553,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114031064_G_C",
              "r2Overall": 0.6531297576645619,
              "posteriorProbability": 0.0020828330175415902,
              "standardError": 0.04536674878320802,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114034565_T_C",
              "r2Overall": 0.641624792913704,
              "posteriorProbability": 0.001760968273695936,
              "standardError": 0.044058657816679225,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114034727_TG_T",
              "r2Overall": 0.6401723545873718,
              "posteriorProbability": 0.0017236357317879569,
              "standardError": 0.04390061042998028,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114025594_C_CT",
              "r2Overall": 0.6213843098299762,
              "posteriorProbability": 0.0013000018415228376,
              "standardError": 0.041987877339474934,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114030985_A_G",
              "r2Overall": 0.6181523235417975,
              "posteriorProbability": 0.0012372749363077152,
              "standardError": 0.04168202014127849,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114028130_C_T",
              "r2Overall": 0.6173804455440868,
              "posteriorProbability": 0.0012226972129875324,
              "standardError": 0.041609922207296854,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114024933_C_T",
              "r2Overall": 0.6173149716692179,
              "posteriorProbability": 0.0012214677067459317,
              "standardError": 0.04160382321198071,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114024981_G_C",
              "r2Overall": 0.6165652432910327,
              "posteriorProbability": 0.0012074668297568565,
              "standardError": 0.04153416967570277,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114026455_A_T",
              "r2Overall": 0.6164882934777517,
              "posteriorProbability": 0.0012060379083134083,
              "standardError": 0.04152703984725178,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114027656_G_A",
              "r2Overall": 0.6160533361101919,
              "posteriorProbability": 0.001197989118178365,
              "standardError": 0.04148680560212323,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114024734_A_G",
              "r2Overall": 0.6160154257421945,
              "posteriorProbability": 0.001197289857625393,
              "standardError": 0.0414833042178833,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114034368_C_T",
              "r2Overall": 0.6155972230382536,
              "posteriorProbability": 0.0011896000562320506,
              "standardError": 0.041444736375393566,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114028794_A_G",
              "r2Overall": 0.6149822976842062,
              "posteriorProbability": 0.0011783725343176557,
              "standardError": 0.04138821609620786,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114034230_T_C",
              "r2Overall": 0.6144074097552941,
              "posteriorProbability": 0.0011679611551921251,
              "standardError": 0.04133557943421613,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114027071_C_A",
              "r2Overall": 0.6142032490546424,
              "posteriorProbability": 0.0011642834343791248,
              "standardError": 0.041316933687377225,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114028553_C_A",
              "r2Overall": 0.6140623083140155,
              "posteriorProbability": 0.001161750546925665,
              "standardError": 0.04130407613643712,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114031150_G_C",
              "r2Overall": 0.613570708895894,
              "posteriorProbability": 0.0011529540914842929,
              "standardError": 0.04125932100218651,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114029391_A_G",
              "r2Overall": 0.6126239847626559,
              "posteriorProbability": 0.001136180181726542,
              "standardError": 0.041173531923178595,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114033242_A_G",
              "r2Overall": 0.6124607885695008,
              "posteriorProbability": 0.0011333106845392738,
              "standardError": 0.04115879667766356,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114029778_C_T",
              "r2Overall": 0.6115213129089931,
              "posteriorProbability": 0.0011169165125386002,
              "standardError": 0.04107427184592907,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114033995_A_T",
              "r2Overall": 0.6110517398294975,
              "posteriorProbability": 0.0011088014763712124,
              "standardError": 0.041032216335564094,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114029950_T_C",
              "r2Overall": 0.6108837928681188,
              "posteriorProbability": 0.001105911794418782,
              "standardError": 0.041017205771029415,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114024617_T_C",
              "r2Overall": 0.6107415569221436,
              "posteriorProbability": 0.0011034697244913555,
              "standardError": 0.04100450590781143,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114025991_C_T",
              "r2Overall": 0.6105129943196667,
              "posteriorProbability": 0.001099555525292105,
              "standardError": 0.04098412259651749,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114034024_C_G",
              "r2Overall": 0.6093979253095104,
              "posteriorProbability": 0.001080635851436958,
              "standardError": 0.04088511046490591,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114041836_T_G",
              "r2Overall": 0.5895648737724287,
              "posteriorProbability": 0.0007890793051662041,
              "standardError": 0.039237320485491174,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114044277_A_G",
              "r2Overall": 0.5799116735340653,
              "posteriorProbability": 0.0006743911390859416,
              "standardError": 0.038507370152107374,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114035930_G_A",
              "r2Overall": 0.5644775610165862,
              "posteriorProbability": 0.0005216872759118131,
              "standardError": 0.03742837182992107,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114041991_T_C",
              "r2Overall": 0.5642838418766137,
              "posteriorProbability": 0.0005199855790335487,
              "standardError": 0.03741547826216369,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114036345_T_C",
              "r2Overall": 0.5638010029337659,
              "posteriorProbability": 0.0005157657536633992,
              "standardError": 0.03738340895318907,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114040492_C_T",
              "r2Overall": 0.5628965456375744,
              "posteriorProbability": 0.0005079435460443775,
              "standardError": 0.03732359487400467,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114036228_T_C",
              "r2Overall": 0.5628343664254675,
              "posteriorProbability": 0.0005074097105419106,
              "standardError": 0.03731949513937295,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114048505_A_C",
              "r2Overall": 0.5619146449855649,
              "posteriorProbability": 0.0004995719450562479,
              "standardError": 0.037259038630922635,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114038428_C_T",
              "r2Overall": 0.5605830896404147,
              "posteriorProbability": 0.000488416607683974,
              "standardError": 0.03717212028089393,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114038107_A_G",
              "r2Overall": 0.5595080807849433,
              "posteriorProbability": 0.0004795738478112697,
              "standardError": 0.0371024702399387,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114035167_G_C",
              "r2Overall": 0.5576201110648811,
              "posteriorProbability": 0.0004643903644793689,
              "standardError": 0.0369812662295493,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114036736_A_G",
              "r2Overall": 0.5575290011094101,
              "posteriorProbability": 0.0004636686557218478,
              "standardError": 0.03697545293459158,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114037277_C_T",
              "r2Overall": 0.5568250057349282,
              "posteriorProbability": 0.00045812589970120295,
              "standardError": 0.03693064475385365,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114024573_CA_C",
              "r2Overall": 0.5568097603115835,
              "posteriorProbability": 0.00045800652784775905,
              "standardError": 0.03692967656637524,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_114043616_T_C",
              "r2Overall": 0.55680484689107,
              "posteriorProbability": 0.0004579680616443133,
              "standardError": 0.036929364550420056,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        },
        {
          "variantId": "10_115876287_A_G",
          "study.id": "GCST90245844",
          "study.traitFromSource": "Height",
          "study.disease.id": "EFO_0004339",
          "study.disease.name": "Height",
          "pValueMantissa": 3.0,
          "pValueExponent": -10,
          "beta": 0.0181,
          "ldPopulationStructure": [
            {
              "ldPopulation": "amr",
              "relativeSampleSize": 1.0
            }
          ],
          "finemappingMethod": "pics",
          "l2g.score": 0.20670542120933533,
          "l2g.target.id": "ENSG00000107518",
          "l2g.target.approvedSymbol": "ATRNL1",
          "locus": [
            {
              "variantId": "10_115876287_A_G",
              "r2Overall": 1.0000000000000036,
              "posteriorProbability": 0.11250244829996882,
              "standardError": 0.9999996219276308,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115867153_C_T",
              "r2Overall": 0.9795072011557364,
              "posteriorProbability": 0.06946076095319362,
              "standardError": 0.40674408133693973,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115866983_C_T",
              "r2Overall": 0.978873579728814,
              "posteriorProbability": 0.06884066316826261,
              "standardError": 0.4012975891573381,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115867214_T_G",
              "r2Overall": 0.978873579728814,
              "posteriorProbability": 0.06884066316826261,
              "standardError": 0.4012975891573381,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115860430_C_CTG",
              "r2Overall": 0.9574341463403644,
              "posteriorProbability": 0.052440847762582475,
              "standardError": 0.2778459127456876,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115861618_T_C",
              "r2Overall": 0.957434146340364,
              "posteriorProbability": 0.05244084776258238,
              "standardError": 0.2778459127456868,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115856357_G_A",
              "r2Overall": 0.9517488953869686,
              "posteriorProbability": 0.04908876245583252,
              "standardError": 0.2568607199985478,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115876257_A_AT",
              "r2Overall": 0.9485042623890504,
              "posteriorProbability": 0.047304282057378355,
              "standardError": 0.24619351802151784,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115866917_A_T",
              "r2Overall": 0.9292501751067376,
              "posteriorProbability": 0.0382313910095029,
              "standardError": 0.1968549527940326,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115855972_A_G",
              "r2Overall": 0.926993490738424,
              "posteriorProbability": 0.03730896512593518,
              "standardError": 0.1922586100858491,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115856676_A_C",
              "r2Overall": 0.9261928198990378,
              "posteriorProbability": 0.036987769562109,
              "standardError": 0.19067490367130432,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115851382_T_C",
              "r2Overall": 0.8807116096823948,
              "posteriorProbability": 0.022804414909188688,
              "standardError": 0.12831262981570604,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115842218_A_T",
              "r2Overall": 0.8614809411875456,
              "posteriorProbability": 0.0185821972919778,
              "standardError": 0.11208877088623082,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115835233_A_G",
              "r2Overall": 0.8581052134049655,
              "posteriorProbability": 0.017922193510080654,
              "standardError": 0.10962444304162232,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115831570_A_G",
              "r2Overall": 0.8566773977438019,
              "posteriorProbability": 0.01764970180230214,
              "standardError": 0.1086119764164984,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115835393_T_A",
              "r2Overall": 0.8566773977438019,
              "posteriorProbability": 0.01764970180230214,
              "standardError": 0.1086119764164984,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115821736_A_G",
              "r2Overall": 0.8478228280404295,
              "posteriorProbability": 0.016044188650746218,
              "standardError": 0.10270078960431724,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115811797_C_A",
              "r2Overall": 0.8434373383422477,
              "posteriorProbability": 0.015300123290038374,
              "standardError": 0.09998967185330776,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115834290_A_G",
              "r2Overall": 0.8234961689449637,
              "posteriorProbability": 0.012298807757002176,
              "standardError": 0.0891883679975953,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115822580_TA_T",
              "r2Overall": 0.8160944763348531,
              "posteriorProbability": 0.011328381759138048,
              "standardError": 0.08572373681576276,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115825196_T_A",
              "r2Overall": 0.8109147878538322,
              "posteriorProbability": 0.010690855647495771,
              "standardError": 0.0834490482986148,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115803314_T_C",
              "r2Overall": 0.8103020596867615,
              "posteriorProbability": 0.010617610691393952,
              "standardError": 0.08318764533587,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115824950_T_C",
              "r2Overall": 0.8102885582939527,
              "posteriorProbability": 0.010616001824333565,
              "standardError": 0.08318190317257627,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115810238_G_T",
              "r2Overall": 0.8102885582939527,
              "posteriorProbability": 0.010616001824333565,
              "standardError": 0.08318190317257627,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115824346_A_G",
              "r2Overall": 0.7992531992846597,
              "posteriorProbability": 0.009371591356321507,
              "standardError": 0.07873273221107294,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115810726_G_T",
              "r2Overall": 0.7941568658183502,
              "posteriorProbability": 0.008842162029270663,
              "standardError": 0.07683154307249852,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115781455_A_G",
              "r2Overall": 0.7889253576896159,
              "posteriorProbability": 0.008326511362552193,
              "standardError": 0.07497197662692612,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115822590_A_G",
              "r2Overall": 0.7831847001929997,
              "posteriorProbability": 0.007791532021123941,
              "standardError": 0.0730318106582269,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115808224_A_G",
              "r2Overall": 0.7818362857170701,
              "posteriorProbability": 0.007670378434177039,
              "standardError": 0.07259057027247982,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115820967_G_A",
              "r2Overall": 0.7781733253441702,
              "posteriorProbability": 0.007349636571886121,
              "standardError": 0.071418572360485,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115867748_T_TTA",
              "r2Overall": 0.7672420324405328,
              "posteriorProbability": 0.006461733365042129,
              "standardError": 0.06813842989735108,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115733140_TG_T",
              "r2Overall": 0.760490116007437,
              "posteriorProbability": 0.005961849084070325,
              "standardError": 0.06626222769335266,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115812049_A_G",
              "r2Overall": 0.7592255560730546,
              "posteriorProbability": 0.005872111591881181,
              "standardError": 0.065922665859164,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115734142_A_T",
              "r2Overall": 0.7577402664018285,
              "posteriorProbability": 0.005768230164721483,
              "standardError": 0.06552843272128964,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115741706_A_T",
              "r2Overall": 0.7573600100913274,
              "posteriorProbability": 0.005741896383991398,
              "standardError": 0.06542829279355873,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115787956_C_G",
              "r2Overall": 0.7554598481683685,
              "posteriorProbability": 0.0056118832722601595,
              "standardError": 0.06493264485608705,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115809134_A_G",
              "r2Overall": 0.7542986692133916,
              "posteriorProbability": 0.005533713926612886,
              "standardError": 0.06463361035292312,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115740195_T_G",
              "r2Overall": 0.7523693705580131,
              "posteriorProbability": 0.005405951111188885,
              "standardError": 0.06414311092352498,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115747758_A_G",
              "r2Overall": 0.752369370558013,
              "posteriorProbability": 0.00540595111118888,
              "standardError": 0.06414311092352494,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115747429_T_C",
              "r2Overall": 0.752369370558013,
              "posteriorProbability": 0.00540595111118888,
              "standardError": 0.06414311092352494,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115753840_G_T",
              "r2Overall": 0.7517387608744951,
              "posteriorProbability": 0.005364756792769994,
              "standardError": 0.06398448160888116,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115808414_G_A",
              "r2Overall": 0.7500268282649437,
              "posteriorProbability": 0.0052543134218800865,
              "standardError": 0.0635579927407309,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115740479_G_A",
              "r2Overall": 0.7487002156547256,
              "posteriorProbability": 0.0051701077672083075,
              "standardError": 0.06323161043353051,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115735204_G_C",
              "r2Overall": 0.7412277876129824,
              "posteriorProbability": 0.004717575651443335,
              "standardError": 0.061457815731420874,
              "is95CredibleSet": true,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115808761_A_G",
              "r2Overall": 0.7357267766069081,
              "posteriorProbability": 0.0044070359114998245,
              "standardError": 0.0602186937826176,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115784801_A_G",
              "r2Overall": 0.7219096496194066,
              "posteriorProbability": 0.003704769583217344,
              "standardError": 0.05733384529968568,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115767050_A_G",
              "r2Overall": 0.7076662950470641,
              "posteriorProbability": 0.0030855183073832727,
              "standardError": 0.05466464535648407,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115796343_C_G",
              "r2Overall": 0.7071460187192308,
              "posteriorProbability": 0.00306473195033617,
              "standardError": 0.05457247246651533,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115776738_G_A",
              "r2Overall": 0.7061416031873419,
              "posteriorProbability": 0.0030249501268679855,
              "standardError": 0.05439553797623358,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115774009_C_T",
              "r2Overall": 0.7061416031873419,
              "posteriorProbability": 0.0030249501268679855,
              "standardError": 0.05439553797623358,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115744575_T_C",
              "r2Overall": 0.7005603483115223,
              "posteriorProbability": 0.002812034655583883,
              "standardError": 0.05343604997216566,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115787661_G_T",
              "r2Overall": 0.6983019804954496,
              "posteriorProbability": 0.002729691102093179,
              "standardError": 0.05305890624614537,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115752362_A_T",
              "r2Overall": 0.6959261164610875,
              "posteriorProbability": 0.002645353904386052,
              "standardError": 0.05266882631231347,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115769043_G_C",
              "r2Overall": 0.6915039762290601,
              "posteriorProbability": 0.0024944483785011816,
              "standardError": 0.05196053214571458,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115783835_T_A",
              "r2Overall": 0.6909073511849974,
              "posteriorProbability": 0.002474678400075057,
              "standardError": 0.0518666993771407,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115760639_C_T",
              "r2Overall": 0.6908761021079282,
              "posteriorProbability": 0.0024736467199238197,
              "standardError": 0.05186179590757394,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            },
            {
              "variantId": "10_115797325_G_A",
              "r2Overall": 0.6686303292548257,
              "posteriorProbability": 0.0018282034879291435,
              "standardError": 0.04863447591757875,
              "is95CredibleSet": false,
              "is99CredibleSet": true
            }
          ]
        }
    ]
  }
}`),
  };
}