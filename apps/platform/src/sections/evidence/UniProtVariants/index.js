import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'uniprot_variants';
export const definition = {
  id: id,
  name: 'UniProt variants',
  shortName: 'UV',
  hasData: data => data.uniprotVariantsSummary.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
