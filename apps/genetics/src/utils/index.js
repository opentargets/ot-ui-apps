import { format } from 'd3-format';

export const commaSeparate = format(',');

export function sanitize(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}


// Consants
export const SIGNIFICANCE = -Math.log10(5e-8);

// Common helpers
export * from './common';

// chromosome helpers
export * from './chromosome';

// Pages helpers
export * from './gene';
export * from './variant';
export * from './study';
export * from './studyLocus';
