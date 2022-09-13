import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'gene2phenotype';
export const definition = {
  id: id,
  name: 'Gene2Phenotype',
  shortName: 'GP',
  hasData: data => data.gene2Phenotype.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
