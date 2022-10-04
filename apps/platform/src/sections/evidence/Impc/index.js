import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'impc';
export const definition = {
  id: id,
  name: 'IMPC',
  shortName: 'IM',
  hasData: data => data.impc.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
