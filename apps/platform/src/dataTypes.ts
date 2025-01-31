import { isPrivateDataType } from "./utils/partnerPreviewUtils";

interface DataType {
  id: string;
  label: string;
  isPrivate: boolean;
}

const dataTypes: DataType[] = [
  {
    id: "genetic_association",
    label: "Genetic associations",
    isPrivate: isPrivateDataType("genetic_association"),
  },
  {
    id: "somatic_mutation",
    label: "Somatic mutations",
    isPrivate: isPrivateDataType("somatic_mutation"),
  },
  {
    id: "known_drug",
    label: "Drugs",
    isPrivate: isPrivateDataType("known_drug"),
  },
  {
    id: "affected_pathway",
    label: "Pathways & systems biology",
    isPrivate: isPrivateDataType("affected_pathway"),
  },
  {
    id: "literature",
    label: "Text mining",
    isPrivate: isPrivateDataType("literature"),
  },
  {
    id: "rna_expression",
    label: "RNA expression",
    isPrivate: isPrivateDataType("rna_expression"),
  },
  {
    id: "animal_model",
    label: "Animal models",
    isPrivate: isPrivateDataType("animal_model"),
  },
  {
    id: "ot_partner",
    label: "OTAR Projects",
    isPrivate: isPrivateDataType("ot_partner"),
  },
  {
    id: "ot_validation_lab",
    label: "OTAR Validation Lab",
    isPrivate: isPrivateDataType("ot_validation_lab"),
  },
];

const dataTypesMap: Record<string, string> = dataTypes.reduce(
  (acc, { id, label }) => {
    acc[id] = label;
    return acc;
  },
  {} as Record<string, string>
);

export { dataTypesMap };
export default dataTypes;