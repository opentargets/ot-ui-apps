export function formatSamples(samples: any[]) {  // wait until get types directly from schema
  return samples
    .map(({ ancestry, sampleSize }) => `${ancestry}: ${sampleSize}`)
    .join(", ");
}