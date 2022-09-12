const id = 'gene2phenotype';
export const definition = {
  id: id,
  name: 'Gene2Phenotype',
  shortName: 'GP',
  hasData: data => data.gene2Phenotype.count > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
