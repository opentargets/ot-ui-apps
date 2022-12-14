import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'intogen';
export const definition = {
  id: id,
  name: 'IntOGen',
  shortName: 'IO',
  hasData: data => data.intOgen.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
