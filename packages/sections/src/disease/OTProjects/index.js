import { isPrivateDiseaseSection } from "../../utils/partnerPreviewUtils";

const id = "otProjects";
export const definition = {
  id,
  name: "Open Targets Projects",
  shortName: "OP",
  hasData: data => data.otarProjects?.length > 0,
  isPrivate: isPrivateDiseaseSection(id),
};
