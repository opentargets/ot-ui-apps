const id = 'orphanet';
export const definition = {
  id: id,
  name: 'Orphanet',
  shortName: 'ON',
  hasData: data => data.orphanetSummary.count > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
