const id = 'eva_somatic';
export const definition = {
  id: id,
  name: 'ClinVar (somatic)',
  shortName: 'CS',
  hasData: ({ evaSomaticSummary }) => evaSomaticSummary.count > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
