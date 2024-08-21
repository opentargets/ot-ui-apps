import {
  Link,
  Tooltip,
  SectionItem,
  PublicationsDrawer,
  DataTable,
  ClinvarStars,
} from "ui";
import { Typography } from "@mui/material";
import {
  clinvarStarMap,
  naLabel,
  defaultRowsPerPageOptions,
} from "../../constants";
import { definition } from ".";

import Description from "./Description";
import { epmcUrl } from "../../utils/urls";
import { sentenceCase } from "../../utils/global";
import EVA_QUERY from "./EVAQuery.gql";

// !! NEEDED??
const onLinkClick = e => {
  // handler to stop propagation of clicks on links in table rows
  // to avoid selection of a different row
  e.stopPropagation();
};

function getColumns(label: string) {
  return [
    {
      id: "disease.name",
      label: "Disease/phenotype",
      renderCell: (d) => {  // !! DESTRUCTURE AS NORMAL WHEN USE GQL WITHOUT THESE ODD PROPERTY NAMES
        const disease_id = d["disease.id"]
        const disease_name = d["disease.name"];
        const { diseaseFromSource, cohortPhenotypes } = d;
        return (
          <Tooltip
            title={
              <>
                <Typography variant="subtitle2" display="block" align="center">
                  Reported disease or phenotype:
                </Typography>
                <Typography variant="caption" display="block" align="center" gutterBottom>
                  {diseaseFromSource}
                </Typography>
                {cohortPhenotypes?.length > 1 ? (
                  <>
                    <Typography variant="subtitle2" display="block" align="center">
                      All reported phenotypes:
                    </Typography>
                    <Typography variant="caption" display="block">
                      {cohortPhenotypes.map(cp => (
                        <div key={cp}>{cp}</div>
                      ))}
                    </Typography>
                  </>
                ) : (
                  ""
                )}
              </>
            }
            showHelpIcon
          >
            {/* !! ANY !! as any needed below since onClick sig expects no args !! */}
            <Link to={`/disease/${disease_id}`} onClick={onLinkClick as any}>
              {disease_name}
            </Link>
        </Tooltip>
        )
      },
      exportLabel: "Disease/Phenotype",
      exportValue: disease_name => disease_name,
      filterValue: disease_name => disease_name,
    },
    {
      id: "studyId",
      label: "ClinVar ID",
      renderCell: ({ studyId }) =>
        studyId ? (
          <Link external to={`https://www.ncbi.nlm.nih.gov/clinvar/${studyId}`}>
            {studyId}
          </Link>
        ) : (
          naLabel
        ),
      exportLabel: "ClinVar ID",
    },
    {
      id: "clinicalSignificances",
      label: "Clinical significance",
      renderCell: ({ clinicalSignificances }) => {
        if (!clinicalSignificances) return naLabel;
        if (clinicalSignificances.length === 1) return sentenceCase(clinicalSignificances[0]);
        if (clinicalSignificances.length > 1)
          return (
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
              }}
            >
              {clinicalSignificances.map(clinicalSignificance => (
                <li key={clinicalSignificance}>{sentenceCase(clinicalSignificance)}</li>
              ))}
            </ul>
          );
        return naLabel;
      },
      filterValue: ({ clinicalSignificances }) => clinicalSignificances.join(),
    },
    {
      id: "allelicRequirements",
      label: "Allele origin",
      renderCell: ({ alleleOrigins, allelicRequirements }) => {
        if (!alleleOrigins || alleleOrigins.length === 0) return naLabel;
        if (allelicRequirements)
          return (
            <Tooltip
              title={
                <>
                  <Typography variant="subtitle2" display="block" align="center">
                    Allelic requirements:
                  </Typography>
                  {allelicRequirements.map(r => (
                    <Typography variant="caption" key={r}>
                      {r}
                    </Typography>
                  ))}
                </>
              }
              showHelpIcon
            >
              {alleleOrigins.map(a => sentenceCase(a)).join("; ")}
            </Tooltip>
          );
        return alleleOrigins.map(a => sentenceCase(a)).join("; ");
      },
      filterValue: ({ alleleOrigins }) => (alleleOrigins ? alleleOrigins.join() : ""),
    },
    {
      id: "reviewStatus",
      label: "Review status",
      renderCell: ({ confidence }) => (
        <Tooltip title={confidence}>
          <span>
            <ClinvarStars num={clinvarStarMap[confidence]} />
          </span>
        </Tooltip>
      ),
    },
    {
      id: "literature",
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

function Body({ id, label, entity }: BodyProps) {
  const variables = {
    variantId: id,
  };

  const request = useQuery(EVA_QUERY, {
    variables,
  });
  
  const columns = getColumns(label);
  const rows = request.data.variant.eva;

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
          // !! TO DO: add dataDownloader
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
    "eva": [
      {
        "alleleOrigins": [
          "germline",
          "maternal",
          "paternal"
        ],
        "allelicRequirements": [
          "Autosomal recessive inheritance"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Diffuse cerebral degeneration in infancy",
          "Infantile poliodystrophy",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive sclerosing poliodystrophy"
        ],
        "confidence": "criteria provided, multiple submitters, no conflicts",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008758",
        "disease.name": "mitochondrial DNA depletion syndrome 4a",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "literature": [
          "11431686",
          "11571332",
          "12565911",
          "14694057",
          "15122711",
          "15477547",
          "15824347",
          "16130100",
          "16177225",
          "17426723",
          "19251978",
          "21276947",
          "26942291",
          "26942292",
          "632821"
        ],
        "studyId": "RCV000014443",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline",
          "maternal",
          "paternal"
        ],
        "allelicRequirements": [
          "Autosomal recessive inheritance"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Diffuse cerebral degeneration in infancy",
          "Infantile poliodystrophy",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive sclerosing poliodystrophy"
        ],
        "confidence": "criteria provided, multiple submitters, no conflicts",
        "directionOnTrait": "risk",
        "disease.id": "Orphanet_726",
        "disease.name": "Alpers syndrome",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "literature": [
          "11431686",
          "11571332",
          "12565911",
          "14694057",
          "15122711",
          "15477547",
          "15824347",
          "16130100",
          "16177225",
          "17426723",
          "19251978",
          "21276947",
          "26942291",
          "26942292",
          "632821"
        ],
        "studyId": "RCV000014443",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline",
          "maternal",
          "paternal"
        ],
        "allelicRequirements": [
          "Autosomal recessive inheritance"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Epilepsy, progressive myoclonic, type 5",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, multiple submitters, no conflicts",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0011835",
        "disease.name": "sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseFromSource": "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "literature": [
          "11431686",
          "11571332",
          "12565911",
          "14694057",
          "15122711",
          "15477547",
          "15824347",
          "16130100",
          "16177225",
          "17426723",
          "19251978",
          "21276947",
          "26942291",
          "26942292",
          "632821"
        ],
        "studyId": "RCV000014441",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline",
          "maternal",
          "paternal"
        ],
        "allelicRequirements": [
          "Autosomal recessive inheritance"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Epilepsy, progressive myoclonic, type 5",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, multiple submitters, no conflicts",
        "directionOnTrait": "risk",
        "disease.id": "Orphanet_70595",
        "disease.name": "Sensory ataxic neuropathy - dysarthria - ophthalmoparesis",
        "diseaseFromSource": "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "literature": [
          "11431686",
          "11571332",
          "12565911",
          "14694057",
          "15122711",
          "15477547",
          "15824347",
          "16130100",
          "16177225",
          "17426723",
          "19251978",
          "21276947",
          "26942291",
          "26942292",
          "632821"
        ],
        "studyId": "RCV000014441",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "allelicRequirements": [
          "Autosomal recessive inheritance"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1"
        ],
        "confidence": "criteria provided, multiple submitters, no conflicts",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0018002",
        "disease.name": "adult-onset chronic progressive external ophthalmoplegia with mitochondrial myopathy",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "literature": [
          "11431686",
          "11571332",
          "12565911",
          "14694057",
          "15122711",
          "15477547",
          "15824347",
          "16130100",
          "16177225",
          "17426723",
          "19251978",
          "21276947",
          "26942291",
          "26942292",
          "632821"
        ],
        "studyId": "RCV000014440",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "allelicRequirements": [
          "Autosomal recessive inheritance"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1"
        ],
        "confidence": "criteria provided, multiple submitters, no conflicts",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0016810",
        "disease.name": "autosomal recessive progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "literature": [
          "11431686",
          "11571332",
          "12565911",
          "14694057",
          "15122711",
          "15477547",
          "15824347",
          "16130100",
          "16177225",
          "17426723",
          "19251978",
          "21276947",
          "26942291",
          "26942292",
          "632821"
        ],
        "studyId": "RCV000014440",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "maternal"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1"
        ],
        "confidence": "criteria provided, multiple submitters, no conflicts",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008003",
        "disease.name": "autosomal dominant progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV000184011",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0018002",
        "disease.name": "adult-onset chronic progressive external ophthalmoplegia with mitochondrial myopathy",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0017575",
        "disease.name": "mitochondrial neurogastrointestinal encephalomyopathy",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 4b",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001198082",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008003",
        "disease.name": "autosomal dominant progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0018002",
        "disease.name": "adult-onset chronic progressive external ophthalmoplegia with mitochondrial myopathy",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001813983",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "Orphanet_726",
        "disease.name": "Alpers syndrome",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Diffuse cerebral degeneration in infancy",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive sclerosing poliodystrophy"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "Orphanet_726",
        "disease.name": "Alpers syndrome",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001004604",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0016810",
        "disease.name": "autosomal recessive progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001813983",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Diffuse cerebral degeneration in infancy",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive sclerosing poliodystrophy"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008758",
        "disease.name": "mitochondrial DNA depletion syndrome 4a",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001004604",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0011835",
        "disease.name": "sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseFromSource": "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "Orphanet_70595",
        "disease.name": "Sensory ataxic neuropathy - dysarthria - ophthalmoparesis",
        "diseaseFromSource": "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "Orphanet_70595",
        "disease.name": "Sensory ataxic neuropathy - dysarthria - ophthalmoparesis",
        "diseaseFromSource": "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "Orphanet_70595",
        "disease.name": "Sensory ataxic neuropathy - dysarthria - ophthalmoparesis",
        "diseaseFromSource": "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001813983",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0017575",
        "disease.name": "mitochondrial neurogastrointestinal encephalomyopathy",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 4b",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001813983",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0017575",
        "disease.name": "mitochondrial neurogastrointestinal encephalomyopathy",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 4b",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0018002",
        "disease.name": "adult-onset chronic progressive external ophthalmoplegia with mitochondrial myopathy",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008758",
        "disease.name": "mitochondrial DNA depletion syndrome 4a",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "Orphanet_726",
        "disease.name": "Alpers syndrome",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "Orphanet_726",
        "disease.name": "Alpers syndrome",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001813983",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008003",
        "disease.name": "autosomal dominant progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0011283",
        "disease.name": "mitochondrial DNA depletion syndrome 1",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 1",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Familial spastic paraparesis",
          "Hereditary spastic paraplegia"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0019064",
        "disease.name": "hereditary spastic paraplegia",
        "diseaseFromSource": "Hereditary spastic paraplegia",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001847600",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0016810",
        "disease.name": "autosomal recessive progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008758",
        "disease.name": "mitochondrial DNA depletion syndrome 4a",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0017575",
        "disease.name": "mitochondrial neurogastrointestinal encephalomyopathy",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 4b",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0011835",
        "disease.name": "sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseFromSource": "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001813983",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008758",
        "disease.name": "mitochondrial DNA depletion syndrome 4a",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001813983",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Inborn genetic diseases"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "EFO_0000508",
        "disease.name": "genetic disorder",
        "diseaseFromSource": "Inborn genetic diseases",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV002316195",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0016810",
        "disease.name": "autosomal recessive progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Diffuse cerebral degeneration in infancy",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive sclerosing poliodystrophy"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0017575",
        "disease.name": "mitochondrial neurogastrointestinal encephalomyopathy",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 4b",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV001004604",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0011835",
        "disease.name": "sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseFromSource": "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Spinocerebellar ataxia with epilepsy"
        ],
        "confidence": "no assertion criteria provided",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0016809",
        "disease.name": "spinocerebellar ataxia with epilepsy",
        "diseaseFromSource": "Spinocerebellar ataxia with epilepsy",
        "diseaseId": "EFO_0000508",
        "diseaseName": "genetic disorder",
        "literature": [
          "11431686",
          "11571332",
          "12565911",
          "14694057",
          "15122711",
          "15477547",
          "15824347",
          "16130100",
          "16177225",
          "17426723",
          "19251978",
          "21276947",
          "26942291",
          "26942292",
          "632821"
        ],
        "studyId": "RCV000014442",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline",
          "maternal",
          "paternal"
        ],
        "allelicRequirements": [
          "Autosomal recessive inheritance"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Diffuse cerebral degeneration in infancy",
          "Infantile poliodystrophy",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive sclerosing poliodystrophy"
        ],
        "confidence": "criteria provided, multiple submitters, no conflicts",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008758",
        "disease.name": "mitochondrial DNA depletion syndrome 4a",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "literature": [
          "11431686",
          "11571332",
          "12565911",
          "14694057",
          "15122711",
          "15477547",
          "15824347",
          "16130100",
          "16177225",
          "17426723",
          "19251978",
          "21276947",
          "26942291",
          "26942292",
          "632821"
        ],
        "studyId": "RCV000014443",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline",
          "maternal",
          "paternal"
        ],
        "allelicRequirements": [
          "Autosomal recessive inheritance"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Epilepsy, progressive myoclonic, type 5",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, multiple submitters, no conflicts",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0011835",
        "disease.name": "sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseFromSource": "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "literature": [
          "11431686",
          "11571332",
          "12565911",
          "14694057",
          "15122711",
          "15477547",
          "15824347",
          "16130100",
          "16177225",
          "17426723",
          "19251978",
          "21276947",
          "26942291",
          "26942292",
          "632821"
        ],
        "studyId": "RCV000014441",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "allelicRequirements": [
          "Autosomal recessive inheritance"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1"
        ],
        "confidence": "criteria provided, multiple submitters, no conflicts",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0018002",
        "disease.name": "adult-onset chronic progressive external ophthalmoplegia with mitochondrial myopathy",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "literature": [
          "11431686",
          "11571332",
          "12565911",
          "14694057",
          "15122711",
          "15477547",
          "15824347",
          "16130100",
          "16177225",
          "17426723",
          "19251978",
          "21276947",
          "26942291",
          "26942292",
          "632821"
        ],
        "studyId": "RCV000014440",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "allelicRequirements": [
          "Autosomal recessive inheritance"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1"
        ],
        "confidence": "criteria provided, multiple submitters, no conflicts",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0016810",
        "disease.name": "autosomal recessive progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "literature": [
          "11431686",
          "11571332",
          "12565911",
          "14694057",
          "15122711",
          "15477547",
          "15824347",
          "16130100",
          "16177225",
          "17426723",
          "19251978",
          "21276947",
          "26942291",
          "26942292",
          "632821"
        ],
        "studyId": "RCV000014440",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "maternal"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1"
        ],
        "confidence": "criteria provided, multiple submitters, no conflicts",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008003",
        "disease.name": "autosomal dominant progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV000184011",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0018002",
        "disease.name": "adult-onset chronic progressive external ophthalmoplegia with mitochondrial myopathy",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0017575",
        "disease.name": "mitochondrial neurogastrointestinal encephalomyopathy",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 4b",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001198082",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008003",
        "disease.name": "autosomal dominant progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0018002",
        "disease.name": "adult-onset chronic progressive external ophthalmoplegia with mitochondrial myopathy",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001813983",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0016810",
        "disease.name": "autosomal recessive progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001813983",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Diffuse cerebral degeneration in infancy",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive sclerosing poliodystrophy"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008758",
        "disease.name": "mitochondrial DNA depletion syndrome 4a",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001004604",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0011835",
        "disease.name": "sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseFromSource": "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0017575",
        "disease.name": "mitochondrial neurogastrointestinal encephalomyopathy",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 4b",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001813983",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0017575",
        "disease.name": "mitochondrial neurogastrointestinal encephalomyopathy",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 4b",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0018002",
        "disease.name": "adult-onset chronic progressive external ophthalmoplegia with mitochondrial myopathy",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008758",
        "disease.name": "mitochondrial DNA depletion syndrome 4a",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008003",
        "disease.name": "autosomal dominant progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MITOCHONDRIAL NEUROGASTROINTESTINAL ENCEPHALOPATHY SYNDROME, TYMP-RELATED",
          "MNGIE, POLG-RELATED",
          "MNGIE, TYMP-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA Depletion Syndrome, MNGIE Form",
          "Mitochondrial DNA depletion syndrome 1",
          "Mitochondrial DNA depletion syndrome 1 (MNGIE type)",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Mitochondrial neurogastrointestinal encephalomyopathy syndrome",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "POLIP SYNDROME",
          "POLYNEUROPATHY, OPHTHALMOPLEGIA, LEUKOENCEPHALOPATHY, AND INTESTINAL PSEUDOOBSTRUCTION",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0011283",
        "disease.name": "mitochondrial DNA depletion syndrome 1",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 1",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV000515354",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0016810",
        "disease.name": "autosomal recessive progressive external ophthalmoplegia",
        "diseaseFromSource": "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008758",
        "disease.name": "mitochondrial DNA depletion syndrome 4a",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "PROGRESSIVE EXTERNAL OPHTHALMOPLEGIA, AUTOSOMAL DOMINANT 1",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal dominant 1",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0017575",
        "disease.name": "mitochondrial neurogastrointestinal encephalomyopathy",
        "diseaseFromSource": "Mitochondrial DNA depletion syndrome 4b",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001731286",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0011835",
        "disease.name": "sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseFromSource": "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001813983",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      },
      {
        "alleleOrigins": [
          "germline"
        ],
        "approvedSymbol": "POLG",
        "clinicalSignificances": [
          "pathogenic"
        ],
        "cohortPhenotypes": [
          "Alpers Syndrome",
          "Alpers diffuse degeneration of cerebral gray matter with hepatic cirrhosis",
          "Alpers disease",
          "Alpers progressive infantile poliodystrophy",
          "Alpers-Huttenlocher Syndrome",
          "Cerebellar ataxia infantile with progressive external ophthalmoplegia",
          "Diffuse cerebral degeneration in infancy",
          "Epilepsy, progressive myoclonic, type 5",
          "Infantile poliodystrophy",
          "MNGIE, POLG-RELATED",
          "Mitochondrial DNA Depletion Syndrome 4A",
          "Mitochondrial DNA depletion syndrome 4A (Alpers type)",
          "Mitochondrial DNA depletion syndrome 4B, MNGIE type",
          "Mitochondrial DNA depletion syndrome 4b",
          "Mitochondrial Neurogastrointestinal Encephalopathy Disease, POLG-Related",
          "Neuronal degeneration of childhood with liver disease, progressive",
          "Poliodystrophia cerebri progressiva",
          "Progressive cerebral poliodystrophy",
          "Progressive external ophthalmoplegia with mitochondrial DNA deletions, autosomal recessive 1",
          "Progressive external ophthalmoplegia, autosomal recessive 1",
          "Progressive sclerosing poliodystrophy",
          "SENSORY ATAXIC NEUROPATHY WITH MITOCHONDRIAL DNA DELETIONS, AUTOSOMAL RECESSIVE",
          "Sensory ataxic neuropathy, dysarthria, and ophthalmoparesis",
          "Sensory ataxic neuropathy-dysarthria-ophthalmoparesis syndrome"
        ],
        "confidence": "criteria provided, single submitter",
        "directionOnTrait": "risk",
        "disease.id": "MONDO_0008758",
        "disease.name": "mitochondrial DNA depletion syndrome 4a",
        "diseaseFromSource": "Progressive sclerosing poliodystrophy",
        "diseaseId": "MONDO_0044970",
        "diseaseName": "mitochondrial disease",
        "studyId": "RCV001813983",
        "targetId": "ENSG00000140521",
        "variantId": "15_89327201_C_T"
      }
    ]
  }
}`),
  };
}