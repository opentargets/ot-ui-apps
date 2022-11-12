import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'chembl';
export const definition = {
  id: id,
  name: 'ChEMBL',
  shortName: 'CE',
  hasData: data => data.chemblSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
