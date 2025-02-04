import config from "../config";

interface PartnerConfig {
  profile: {
    partnerTargetSectionIds: string[];
    partnerDiseaseSectionIds: string[];
    partnerDrugSectionIds: string[];
    partnerEvidenceSectionIds: string[];
    partnerDataTypes: string[];
    partnerDataSources: string[];
  };
}

// page sections
export const isPrivateTargetSection = (id: string): boolean =>
  (config as PartnerConfig).profile.partnerTargetSectionIds.includes(id);

export const isPrivateDiseaseSection = (id: string): boolean =>
  (config as PartnerConfig).profile.partnerDiseaseSectionIds.includes(id);

export const isPrivateDrugSection = (id: string): boolean =>
  (config as PartnerConfig).profile.partnerDrugSectionIds.includes(id);

export const isPrivateEvidenceSection = (id: string): boolean =>
  (config as PartnerConfig).profile.partnerEvidenceSectionIds.includes(id);

// associations
export const isPrivateDataType = (id: string): boolean =>
  (config as PartnerConfig).profile.partnerDataTypes.includes(id);

export const isPrivateDataSource = (id: string): boolean =>
  (config as PartnerConfig).profile.partnerDataSources.includes(id);
