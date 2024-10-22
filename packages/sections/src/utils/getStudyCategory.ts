// currently resolve study category purely from projectId
export function getStudyCategory(projectId: string) {
  if (!projectId) return '';
  if (projectId === "GCST") return "GWAS";
  if (projectId.startsWith("FINNGEN")) return "FINNGEN";
  return "QTL";
}