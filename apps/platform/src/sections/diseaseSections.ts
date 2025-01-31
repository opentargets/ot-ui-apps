import { lazy } from "react";

const diseaseSections = new Map([
  ["ontology", lazy(() => import("sections/src/disease/Ontology/Body"))],
  ["knownDrugs", lazy(() => import("sections/src/disease/KnownDrugs/Body"))],
  ["phenotypes", lazy(() => import("sections/src/disease/Phenotypes/Body"))],
  ["otProjects", lazy(() => import("sections/src/disease/OTProjects/Body"))],
  ["bibliography", lazy(() => import("sections/src/disease/Bibliography/Body"))],
]);

export default diseaseSections;
