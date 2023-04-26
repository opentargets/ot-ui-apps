import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'gene_burden';
export const definition = {
  id,
  name: 'Gene Burden',
  shortName: 'GB',
  hasData: data => data.geneBurdenSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
