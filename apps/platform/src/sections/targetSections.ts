import { lazy } from "react";

const targetSections = new Map([
  ["tractability", lazy(() => import("sections/src/target/Tractability/Body"))],
  ["knownDrugs", lazy(() => import("sections/src/target/KnownDrugs/Body"))],
  ["safety", lazy(() => import("sections/src/target/Safety/Body"))],
  ["expressions", lazy(() => import("sections/src/target/Expression/Body"))],
  ["depMapEssentiality", lazy(() => import("sections/src/target/DepMap/Body"))],
  ["geneOntology", lazy(() => import("sections/src/target/GeneOntology/Body"))],
  ["protVista", lazy(() => import("sections/src/target/ProtVista/Body"))],
  ["pathways", lazy(() => import("sections/src/target/Pathways/Body"))],
  ["bibliography", lazy(() => import("sections/src/target/Bibliography/Body"))],
  ["subcellularLocation", lazy(() => import("sections/src/target/SubcellularLocation/Body"))],
  ["chemicalProbes", lazy(() => import("sections/src/target/ChemicalProbes/Body"))],
  ["cancerHallmarks", lazy(() => import("sections/src/target/CancerHallmarks/Body"))],
  ["geneticConstraint", lazy(() => import("sections/src/target/GeneticConstraint/Body"))],
  ["interactions", lazy(() => import("sections/src/target/MolecularInteractions/Body"))],
  ["mousePhenotypes", lazy(() => import("sections/src/target/MousePhenotypes/Body"))],
  ["compGenomics", lazy(() => import("sections/src/target/ComparativeGenomics/Body"))],
]);

export default targetSections;
