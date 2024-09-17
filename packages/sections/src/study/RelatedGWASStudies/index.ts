const id = "related_gwas_studies";
export const definition = {
  id,
  name: "Related GWAS Studies",
  shortName: "RS",
  hasData: data => {
    return data?.length || data?.relatedGWASStudies?.length;
  }
};