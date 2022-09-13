const id = 'progeny';
export const definition = {
  id: id,
  name: 'PROGENy',
  shortName: 'PY',
  hasData: data => data.progeny.count > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
