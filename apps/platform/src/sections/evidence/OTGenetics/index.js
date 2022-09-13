const id = 'ot_genetics_portal';
export const definition = {
  id: id,
  name: 'OT Genetics Portal',
  shortName: 'OG',
  hasData: data => data.openTargetsGenetics.count > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
