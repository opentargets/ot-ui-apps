import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';
import UNIPROT_VARIANTS_SUMMARY from './UniprotVariantsSummaryQuery.gql';

const id = 'uniprot_variants';
export const definition = {
  id: id,
  name: 'UniProt variants',
  shortName: 'UV',
  hasData: data => data.uniprotVariantsSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
  countQuery: UNIPROT_VARIANTS_SUMMARY,
};

export { default as Summary } from './Summary';
export * from './Body';
