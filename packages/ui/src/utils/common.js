export const convertCamelToFlat = (camelCaseWord) => {
  const camelCase = camelCaseWord
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ");

  let flat = "";

  camelCase.forEach((word) => {
    flat = flat + word.charAt(0).toUpperCase() + word.slice(1) + " ";
  });
  return flat;
};
