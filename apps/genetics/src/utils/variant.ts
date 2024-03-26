import {
  G2VSchema,
  IndexVariantsAndStudiesForTagVariant,
  TagVariantsAndStudiesForIndexVariant,
} from "../__generated__/graphql";

type IndexVariantData = {
  indexVariantsAndStudiesForTagVariant?: IndexVariantsAndStudiesForTagVariant;
};
export function variantTransformAssociatedIndexVariants(data?: IndexVariantData) {
  if (!data?.indexVariantsAndStudiesForTagVariant?.associations?.length) {
    return [];
  }
  return data.indexVariantsAndStudiesForTagVariant.associations.map(d => {
    const { indexVariant, study, ...rest } = d;
    return {
      indexVariantId: indexVariant.id,
      indexVariantRsId: indexVariant.rsId,
      studyId: study.studyId,
      traitReported: study.traitReported,
      pmid: study.pmid,
      pubDate: study.pubDate,
      pubAuthor: study.pubAuthor,
      hasSumstats: study.hasSumstats,
      ...rest,
    };
  });
}

type TagVariantData = {
  tagVariantsAndStudiesForIndexVariant?: TagVariantsAndStudiesForIndexVariant;
};
export function variantTransformAssociatedTagVariants(data?: TagVariantData) {
  if (!data?.tagVariantsAndStudiesForIndexVariant?.associations?.length) {
    return [];
  }
  return data.tagVariantsAndStudiesForIndexVariant.associations.map(d => {
    const { tagVariant, study, ...rest } = d;
    return {
      tagVariantId: tagVariant.id,
      tagVariantRsId: tagVariant.rsId,
      studyId: study.studyId,
      traitReported: study.traitReported,
      pmid: study.pmid,
      pubDate: study.pubDate,
      pubAuthor: study.pubAuthor,
      hasSumstats: study.hasSumstats,
      ...rest,
    };
  });
}

export const variantPopulations = [
  { code: "AFR", description: "African/African-American" },
  { code: "AMR", description: "Latino/Admixed American" },
  { code: "ASJ", description: "Ashkenazi Jewish" },
  { code: "EAS", description: "East Asian" },
  { code: "FIN", description: "Finnish" },
  { code: "NFE", description: "Non-Finnish European" },
  { code: "NFEEST", description: "Non-Finnish European Estonian" },
  {
    code: "NFENWE",
    description: "Non-Finnish European North-Western European",
  },
  { code: "NFESEU", description: "Non-Finnish European Southern European" },
  { code: "OTH", description: "Other (population not assigned)" },
];

type VariantSchemaData = {
  genesForVariantSchema?: G2VSchema;
};
export function variantParseGenesForVariantSchema(data?: VariantSchemaData) {
  const genesForVariantSchema = data?.genesForVariantSchema;
  if (!genesForVariantSchema) return;
  const currentQtls = genesForVariantSchema.qtls;
  if (currentQtls.length === 0) return genesForVariantSchema;
  //possibly add new fields
  if (currentQtls[0].id === "pqtl") {
    const pqtl = currentQtls[0];
    const restQtls = currentQtls.slice(1);
    const sourceDescriptionBreakdown = parseSourceDescriptionBreakdown(
      pqtl.sourceDescriptionBreakdown
    );
    const sourceLabel = parseSourceLabel(pqtl.sourceLabel);
    const newPqtl = { ...pqtl, sourceDescriptionBreakdown, sourceLabel };
    const newQtls = [newPqtl, ...restQtls];
    return { ...genesForVariantSchema, qtls: newQtls };
  }
  return genesForVariantSchema;
}

function parseSourceDescriptionBreakdown(description?: string | null) {
  if (!description) return;
  return description.replace(" Sun *et al.* (2018)", "");
}

function parseSourceLabel(label?: string | null) {
  if (!label) return;
  return label.replace(" (Sun, 2018)", "");
}
