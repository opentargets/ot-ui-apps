import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'clingen';
export const definition = {
  id: id,
  name: 'ClinGen',
  shortName: 'CG',
  hasData: data => data.clingenSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
