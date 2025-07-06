
import { Drug } from 'sections';

export const drugWidgets = new Map([
  [Drug.Indications.definition.id, Drug.Indications.getBodyComponent],
  [Drug.KnownDrugs.definition.id, Drug.KnownDrugs.getBodyComponent],
  [Drug.DrugWarnings.definition.id, Drug.DrugWarnings.getBodyComponent],
  [Drug.AdverseEvents.definition.id, Drug.AdverseEvents.getBodyComponent],
  [Drug.Bibliography.definition.id, Drug.Bibliography.getBodyComponent],
  [Drug.MechanismsOfAction.definition.id, Drug.MechanismsOfAction.getBodyComponent],
  [Drug.Pharmacogenomics.definition.id, Drug.Pharmacogenomics.getBodyComponent],
]);

export const drugWidgetsSummaries = [
  Drug.Indications.Summary,
  Drug.KnownDrugs.Summary,
  Drug.DrugWarnings.Summary,
  Drug.AdverseEvents.Summary,
  Drug.Bibliography.Summary,
  Drug.MechanismsOfAction.Summary,
  Drug.Pharmacogenomics.Summary,
];
