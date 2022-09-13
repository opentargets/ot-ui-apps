const id = 'sysbio';
export const definition = {
  id: id,
  name: 'Gene signatures',
  shortName: 'GS',
  hasData: data => data.sysBio.count > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
