import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'expression_atlas';
export const definition = {
  id: id,
  name: 'Expression Atlas',
  shortName: 'EA',
  hasData: ({ expressionAtlasSummary }) => expressionAtlasSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
