const id = 'impc';
export const definition = {
  id: id,
  name: 'IMPC',
  shortName: 'IM',
  hasData: data => data.impc.count > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
