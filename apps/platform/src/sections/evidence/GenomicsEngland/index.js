import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'genomics_england';
export const definition = {
  id: id,
  name: 'GEL PanelApp',
  shortName: 'GE',
  hasData: data => data.genomicsEngland.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
