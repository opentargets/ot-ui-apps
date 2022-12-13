import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'orphanet';
export const definition = {
  id: id,
  name: 'Orphanet',
  shortName: 'ON',
  hasData: data => data.orphanetSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
