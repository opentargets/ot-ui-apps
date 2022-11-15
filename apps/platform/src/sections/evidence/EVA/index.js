import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'eva';
export const definition = {
  id: id,
  name: 'ClinVar',
  shortName: 'CV',
  hasData: ({ evaSummary }) => evaSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
