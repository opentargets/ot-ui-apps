import { Target } from "sections";
import { getConfig } from "@ot/config";

const isPPP = getConfig().profile.isPartnerPreview;

const targetSections = new Map([
  ["tractability", Target.Tractability.getBodyComponent()],
  ["knownDrugs", Target.KnownDrugs.getBodyComponent()],
  ["safety", Target.Safety.getBodyComponent()],
  ["expressions", Target[isPPP ? "BaselineExpression" : "Expression"].getBodyComponent()],
  ["depMapEssentiality", Target.DepMap.getBodyComponent()],
  ["geneOntology", Target.GeneOntology.getBodyComponent()],
  ["molecularStructure", Target.MolecularStructure.getBodyComponent()],
  ["pathways", Target.Pathways.getBodyComponent()],
  ["bibliography", Target.Bibliography.getBodyComponent()],
  ["subcellularLocation", Target.SubcellularLocation.getBodyComponent()],
  ["chemicalProbes", Target.ChemicalProbes.getBodyComponent()],
  ["cancerHallmarks", Target.CancerHallmarks.getBodyComponent()],
  ["geneticConstraint", Target.GeneticConstraint.getBodyComponent()],
  ["interactions", Target.MolecularInteractions.getBodyComponent()],
  ["mousePhenotypes", Target.MousePhenotypes.getBodyComponent()],
  ["compGenomics", Target.ComparativeGenomics.getBodyComponent()],
  ["qtlCredibleSets", Target.QTLCredibleSets.getBodyComponent()],
]);

export default targetSections;
