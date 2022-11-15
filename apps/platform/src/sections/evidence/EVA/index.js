import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';
import EVA_SUMMARY from './EVASummaryQuery.gql';

const id = 'eva';
export const definition = {
  id: id,
  name: 'ClinVar',
  shortName: 'CV',
  hasData: ({ evaSummary }) => evaSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
  countQuery: EVA_SUMMARY,
};

export { default as Summary } from './Summary';
export * from './Body';
