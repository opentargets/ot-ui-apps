/**
 * Formats a number to show only the first 3 non-zero significant digits.
 * Falls back to scientific notation for very small (<1e-3) or large (>=1e4) magnitudes.
 */
export function formatSignificantDigits(
  value: number | string | null | undefined
): string | number | null | undefined {
  if (value === null || value === undefined) return value;

  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value;
  if (num === 0) return "0";

  const absNum = Math.abs(num);

  // Use scientific notation for extreme magnitudes
  if (absNum < 1e-3 || absNum >= 1e4) {
    return num.toExponential(2);
  }

  // Determine required decimal places to keep 3 significant digits
  const magnitude = Math.floor(Math.log10(absNum)) + 1; // digits before decimal
  const decimalPlaces = Math.max(0, 3 - magnitude);

  const rounded = Math.round(absNum * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  const formatted = rounded.toFixed(decimalPlaces);
  const trimmed = formatted.replace(/\.?0+$/, "");

  return num < 0 ? `-${trimmed}` : trimmed;
}


