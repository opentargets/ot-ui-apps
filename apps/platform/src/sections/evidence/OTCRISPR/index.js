import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'ot_crispr';
export const definition = {
  id: id,
  name: 'Open Targets CRISPR',
  shortName: 'OT',
  hasData: ({ OtCrisprSummary }) => OtCrisprSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
