import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import { Header as HeaderBase, XRefLinks } from "ui";
import { VariantPageDataType } from "./types";

const xrefsToDisplay = {
  ensemblVariation: {
    label: "Ensembl",
    urlStem: "https://www.ensembl.org/Homo_sapiens/Variation/Explore?v=",
  },
  gnomad: {
    label: "gnomAD",
    urlBuilder: id => `https://gnomad.broadinstitute.org/variant/${id}?dataset=gnomad_r4`,
  },
  protvar: {
    label: "ProtVar",
    urlBuilder: (id,  { chromosome, position, referenceAllele, alternateAllele }) => (
      `https://www.ebi.ac.uk/ProtVar/query?chromosome=${chromosome
        }&genomic_position=${position
        }&reference_allele=${referenceAllele
        }&alternative_allele=${alternateAllele}`
    ),
  },
  clinVar: {
    label: "ClinVar",
    urlStem: "https://www.ncbi.nlm.nih.gov/clinvar/variation/",
  },
  omim: {
    label: "OMIM",
    urlStem: "https://www.omim.org/entry/",
  },
};

function processXRefs(dbXRefs) {
  const xrefs = {};
  for (const { id, source } of dbXRefs) {
    const { label, urlBuilder, urlStem } = xrefsToDisplay[source];   
    if (xrefs[source]) {
        xrefs[source].ids.add(id);
    } else {
      xrefs[source] = {
        label,
        urlStem,
        urlBuilder,
        ids: new Set([id]),
      };
    }
  }
  return xrefs;
}

type HeaderProps = {
  loading: boolean;
  variantId: string;
  variantPageData: VariantPageDataType;
};

function Header({ loading, variantId, variantPageData }: HeaderProps) {

  const xrefs = processXRefs(variantPageData?.dbXrefs || []);

  return (
    <HeaderBase
      loading={loading}
      title={variantId}
      Icon={faMapPin}
      externalLinks={
        <>
          {Object.keys(xrefs).map(xref => {
            const { label, urlBuilder, urlStem, ids } = xrefs[xref];
            return (
              <XRefLinks
                key={xref}
                label={label}
                urlStem={urlStem}
                urlBuilder={urlBuilder ? (id => urlBuilder(id, variantPageData)) : null}
                ids={[...ids]}
                extraUrlData={variantPageData}
                limit="3"
              />
            );
          })}
        </>
      }
    />
  );
}

export default Header;