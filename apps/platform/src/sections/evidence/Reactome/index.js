import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'reactome';
export const definition = {
  id: id,
  name: 'Reactome',
  shortName: 'RT',
  hasData: ({ reactomeSummary }) => reactomeSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
