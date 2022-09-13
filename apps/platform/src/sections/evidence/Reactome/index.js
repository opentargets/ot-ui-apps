const id = 'reactome';
export const definition = {
  id: id,
  name: 'Reactome',
  shortName: 'RT',
  hasData: ({ reactomeSummary }) => reactomeSummary.count > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
