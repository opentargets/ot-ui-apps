export const definition = {
  id: 'depMapEssentiality',
  name: 'Cancer DepMap',
  shortName: 'DM',
  hasData: data => true, //data => data.hallmarks?.cancerHallmarks?.length > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
