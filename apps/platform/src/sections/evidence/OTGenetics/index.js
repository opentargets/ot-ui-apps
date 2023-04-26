import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'ot_genetics_portal';
export const definition = {
  id,
  name: 'OT Genetics Portal',
  shortName: 'OG',
  hasData: data => data.openTargetsGenetics.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
