import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'europepmc';
export const definition = {
  id,
  name: 'Europe PMC',
  shortName: 'EP',
  hasData: data => data.europePmc.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
