const id = 'eva';
export const definition = {
  id: id,
  name: 'ClinVar',
  shortName: 'CV',
  hasData: ({ evaSummary }) => evaSummary.count > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
