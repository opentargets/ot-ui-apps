import { isPrivateEvidenceSection } from '../../../utils/partnerPreviewUtils';

const id = 'progeny';
export const definition = {
  id: id,
  name: 'PROGENy',
  shortName: 'PY',
  hasData: data => data.progeny.count > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from './Summary';
export * from './Body';
