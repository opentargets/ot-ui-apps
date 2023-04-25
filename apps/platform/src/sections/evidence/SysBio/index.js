import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'sysbio';
export const definition = {
  id: id,
  name: 'Gene signatures',
  shortName: 'GS',
  hasData: data => data.sysBio.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
