import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'ot_genetics_portal';
export const definition = {
  id: id,
  name: 'Open Targets Genetics',
  shortName: 'OG',
  hasData: data => data.openTargetsGenetics.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
