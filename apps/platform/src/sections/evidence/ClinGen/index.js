const id = 'clingen';
export const definition = {
  id: id,
  name: 'ClinGen',
  shortName: 'CG',
  hasData: data => data.clingenSummary.count > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
