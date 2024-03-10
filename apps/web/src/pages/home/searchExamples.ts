type Entity = "disease" | "drug" | "target";

type Suggestion = {
  type: string;
  entity: Entity;
  name: string;
  id: string;
};

type Examples = {
  targets: Suggestion[];
  diseases: Suggestion[];
  drugs: Suggestion[];
};

export const pppSearchExamples: Examples = {
  targets: [
    { type: "suggestion", entity: "target", name: "WRN", id: "ENSG00000165392" },
    { type: "suggestion", entity: "target", name: "KRAS", id: "ENSG00000133703" },
    { type: "suggestion", entity: "target", name: "WDR7", id: "ENSG00000091157" },
    { type: "suggestion", entity: "target", name: "PAK2", id: "ENSG00000180370" },
  ],
  diseases: [
    { type: "suggestion", entity: "disease", name: "Atopic Eczema", id: "EFO_0000274" },
    { type: "suggestion", entity: "disease", name: "Psoriasis", id: "EFO_0000676" },
    { type: "suggestion", entity: "disease", name: "Alzheimer Disease", id: "MONDO_0004975" },
    { type: "suggestion", entity: "disease", name: "Parkinson Disease", id: "MONDO_0005180" },
    { type: "suggestion", entity: "disease", name: "Colorectal Cancer", id: "MONDO_0005575" },
    { type: "suggestion", entity: "disease", name: "Colorectal Neoplasm", id: "EFO_0004142" },
  ],
  drugs: [
    { type: "suggestion", entity: "drug", name: "ROFECOXIB", id: "CHEMBL122" },
    { type: "suggestion", entity: "drug", name: "REGRELOR", id: "CHEMBL1162175" },
    { type: "suggestion", entity: "drug", name: "METFORMIN", id: "CHEMBL1431" },
    { type: "suggestion", entity: "drug", name: "ACETAMINOPHEN", id: "CHEMBL112" },
    { type: "suggestion", entity: "drug", name: "THALIDOMIDE", id: "CHEMBL468" },
    { type: "suggestion", entity: "drug", name: "HUMIRA", id: "CHEMBL1201580" },
    { type: "suggestion", entity: "drug", name: "VIAGRA", id: "CHEMBL192" },
    { type: "suggestion", entity: "drug", name: "TAGRISSO", id: "CHEMBL3353410" },
    { type: "suggestion", entity: "drug", name: "IVACAFTOR", id: "CHEMBL2010601" },
    { type: "suggestion", entity: "drug", name: "LYRICA", id: "CHEMBL1059" },
  ],
};

export const searchExamples: Examples = {
  targets: [
    { type: "suggestion", entity: "target", name: "IL13", id: "ENSG00000169194" },
    { type: "suggestion", entity: "target", name: "TSLP", id: "ENSG00000145777" },
    { type: "suggestion", entity: "target", name: "ADAM33", id: "ENSG00000149451" },
    { type: "suggestion", entity: "target", name: "CFTR", id: "ENSG00000001626" },
    { type: "suggestion", entity: "target", name: "KIT", id: "ENSG00000157404" },
    { type: "suggestion", entity: "target", name: "NOD2", id: "ENSG00000167207" },
    { type: "suggestion", entity: "target", name: "TYK2", id: "ENSG00000105397" },
    { type: "suggestion", entity: "target", name: "TNF", id: "ENSG00000232810" },
    { type: "suggestion", entity: "target", name: "PTGS2", id: "ENSG00000073756" },
    { type: "suggestion", entity: "target", name: "ADORA3", id: "ENSG00000282608" },
    { type: "suggestion", entity: "target", name: "APP", id: "ENSG00000142192" },
    { type: "suggestion", entity: "target", name: "GRIN3A", id: "ENSG00000198785" },
    { type: "suggestion", entity: "target", name: "IL2RA", id: "ENSG00000134460" },
    { type: "suggestion", entity: "target", name: "ACHE", id: "ENSG00000087085" },
    { type: "suggestion", entity: "target", name: "SNCA", id: "ENSG00000145335" },
    { type: "suggestion", entity: "target", name: "BRAF", id: "ENSG00000157764" },
    { type: "suggestion", entity: "target", name: "BRCA2", id: "ENSG00000139618" },
    { type: "suggestion", entity: "target", name: "KRAS", id: "ENSG00000133703" },
    { type: "suggestion", entity: "target", name: "PTEN", id: "ENSG00000171862" },
    { type: "suggestion", entity: "target", name: "TP53", id: "ENSG00000141510" },
  ],
  diseases: [
    { type: "suggestion", entity: "disease", name: "Asthma", id: "MONDO_0004979" },
    { type: "suggestion", entity: "disease", name: "Lung Disease", id: "EFO_0003818" },
    { type: "suggestion", entity: "disease", name: "Childhood Onset Asthma", id: "MONDO_0005405" },
    { type: "suggestion", entity: "disease", name: "Pneumonia", id: "EFO_0003106" },
    { type: "suggestion", entity: "disease", name: "Cystic Fibrosis", id: "MONDO_0009061" },
    { type: "suggestion", entity: "disease", name: "Eczema", id: "HP_0000964" },
    {
      type: "suggestion",
      entity: "disease",
      name: "Inflammatory Bowel Disease",
      id: "EFO_0003767",
    },
    { type: "suggestion", entity: "disease", name: "Crohn's Disease", id: "EFO_0000384" },
    { type: "suggestion", entity: "disease", name: "Ulcerative Colitis", id: "EFO_0000729" },
    { type: "suggestion", entity: "disease", name: "Liver Disease", id: "EFO_0001421" },
    { type: "suggestion", entity: "disease", name: "Rheumatoid Arthritis", id: "EFO_0000685" },
    { type: "suggestion", entity: "disease", name: "Brain Disease", id: "EFO_0005774" },
    { type: "suggestion", entity: "disease", name: "Multiple Sclerosis", id: "MONDO_0005301" },
    { type: "suggestion", entity: "disease", name: "Schizophrenia", id: "MONDO_0005090" },
    { type: "suggestion", entity: "disease", name: "Alzheimers Disease", id: "MONDO_0004975" },
    { type: "suggestion", entity: "disease", name: "Dementia", id: "MONDO_0001627" },
    { type: "suggestion", entity: "disease", name: "Noonan Syndrome", id: "MONDO_0018997" },
    { type: "suggestion", entity: "disease", name: "Melanoma", id: "EFO_0000756" },
    { type: "suggestion", entity: "disease", name: "Leukemia", id: "EFO_0000565" },
    { type: "suggestion", entity: "disease", name: "Cowden Syndrome", id: "MONDO_0016063" },
  ],
  drugs: [
    { type: "suggestion", entity: "drug", name: "ROFECOXIB", id: "CHEMBL122" },
    { type: "suggestion", entity: "drug", name: "REGRELOR", id: "CHEMBL1162175" },
    { type: "suggestion", entity: "drug", name: "METFORMIN", id: "CHEMBL1431" },
    { type: "suggestion", entity: "drug", name: "ACETAMINOPHEN", id: "CHEMBL112" },
    { type: "suggestion", entity: "drug", name: "THALIDOMIDE", id: "CHEMBL468" },
    { type: "suggestion", entity: "drug", name: "HUMIRA", id: "CHEMBL1201580" },
    { type: "suggestion", entity: "drug", name: "VIAGRA", id: "CHEMBL192" },
    { type: "suggestion", entity: "drug", name: "TAGRISSO", id: "CHEMBL3353410" },
    { type: "suggestion", entity: "drug", name: "IVACAFTOR", id: "CHEMBL2010601" },
    { type: "suggestion", entity: "drug", name: "LYRICA", id: "CHEMBL1059" },
  ],
};
