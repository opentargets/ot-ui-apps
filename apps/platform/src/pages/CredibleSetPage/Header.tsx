import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import { Header as HeaderBase, XRefLinks, DisplayVariantId, ExternalLink } from "ui";

// const xrefsToDisplay = {
//   ensembl_variation: {
//     label: "Ensembl",
//     urlStem: "https://www.ensembl.org/Homo_sapiens/Variation/Explore?v=",
//   },
//   gnomad: {
//     label: "gnomAD",
//     urlBuilder: id => `https://gnomad.broadinstitute.org/variant/${id}?dataset=gnomad_r4`,
//   },
//   protvar: {
//     label: "ProtVar",
//     urlBuilder: (id,  { chromosome, position, referenceAllele, alternateAllele }) => (
//       `https://www.ebi.ac.uk/ProtVar/query?chromosome=${chromosome
//         }&genomic_position=${position
//         }&reference_allele=${referenceAllele
//         }&alternative_allele=${alternateAllele}`
//     ),
//   },
//   clinvar: {
//     label: "ClinVar",
//     urlStem: "https://www.ncbi.nlm.nih.gov/clinvar/variation/",
//   },
//   omim: {
//     label: "OMIM",
//     urlStem: "https://www.omim.org/entry/",
//   },
// };

// function processXRefs(dbXRefs) {
//   const xrefs = {};
//   for (const { id, source } of dbXRefs) {
//     const { label, urlBuilder, urlStem } = xrefsToDisplay[source];   
//     if (xrefs[source]) {
//         xrefs[source].ids.add(id);
//     } else {
//       xrefs[source] = {
//         label,
//         urlStem,
//         urlBuilder,
//         ids: new Set([id]),
//       };
//     }
//   }
//   return xrefs;
// }

type HeaderProps = {
  loading: boolean;
  studyLocusId: string;
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
  studyId: string;
};

function Header({
      loading,
      variantId,
      referenceAllele,
      alternateAllele,
      studyId 
    }: HeaderProps) {

  // const xrefs = processXRefs(variantPageData?.dbXrefs || []);

  return (
    <HeaderBase
      loading={loading}
      title={
        <>
          Credible set around{" "}
          <DisplayVariantId
            variantId={variantId}
            referenceAllele={referenceAllele}
            alternateAllele={alternateAllele}
            expand={false}
          />
          {" "}for study {studyId}
        </>
      } 
      Icon={faDiagramProject}
      externalLinks={
        <>
          <ExternalLink
            title="Variant ID"
            id={
              <DisplayVariantId
                variantId={variantId}
                referenceAllele={referenceAllele}
                alternateAllele={alternateAllele}
                expand={false}
              />
            }
            url={`../variant/${variantId}`}
          />
          <ExternalLink
            title="Study ID"
            id={studyId}
            url={`../sudy/${studyId}`}
          />
        </>
      }
    />
  );
}

export default Header;