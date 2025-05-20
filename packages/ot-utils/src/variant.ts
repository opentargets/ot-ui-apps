export function processVariantId(id: string, referenceAllele: string, alternateAllele: string) {
  const idParts = id.split("_");
  if (idParts[0] === "OTVAR") {
    idParts.shift();
  }
  let isHashed, stem;
  if (idParts.at(-2) === referenceAllele && idParts.at(-1) === alternateAllele) {
    isHashed = false;
    stem = idParts.slice(0, -2).join("_");
  } else {
    isHashed = true;
    stem = idParts.slice(0, -1).join("_");
  }
  return { isHashed, stem };
}
