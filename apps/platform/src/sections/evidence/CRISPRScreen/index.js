import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'crispr_screen';
export const definition = {
  id: id,
  name: 'CRISPR Screens',
  shortName: 'CS',
  hasData: ({ CrisprScreenSummary }) => CrisprScreenSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
