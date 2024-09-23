// currently resolve study category purely from projectId
export function getStudyCategory(projectId: string) {
  let studyCategory = '';
  if (projectId) {
    if (projectId === "GCST") studyCategory = "GWAS";
    else if (projectId === "FINNGEN_R10") studyCategory = "FINNGEN";
    else studyCategory = "QTL";
  }
  return studyCategory;
}