import { lazy } from "react";

const targetSections = new Map([
  ["indications", lazy(() => import("sections/src/drug/Indications/Body"))],
  ["knownDrugs", lazy(() => import("sections/src/drug/KnownDrugs/Body"))],
  ["drugWarnings", lazy(() => import("sections/src/drug/DrugWarnings/Body"))],
  ["adverseEvents", lazy(() => import("sections/src/drug/AdverseEvents/Body"))],
  ["bibliography", lazy(() => import("sections/src/drug/Bibliography/Body"))],
  ["mechanismsOfAction", lazy(() => import("sections/src/drug/MechanismsOfAction/Body"))],
]);

export default targetSections;
