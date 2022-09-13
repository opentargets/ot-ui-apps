const id = 'intogen';
export const definition = {
  id: id,
  name: 'IntOGen',
  shortName: 'IO',
  hasData: data => data.intOgen.count > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
