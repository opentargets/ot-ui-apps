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

/**
 * Formats a decimal value as a percentage string (without the % symbol).
 * - Values >= 0.01 (1%) are shown as integers
 * - Values < 0.01 show decimal places up to the first non-zero digit
 * - Zero is shown as '0'
 */
export function formatPercentage(value: number) {
  const percentage = value * 100;
  
  // If >= 1, show as integer
  if (percentage >= 1) {
    return percentage.toFixed(0);
  }
 
  // If 0, return '0'
  if (percentage === 0) {
    return '0';
  }
  
  // For values < 1, find the first non-zero decimal digit
  const str = percentage.toString();
  const match = str.match(/\.0*[1-9]/);
  
  if (match) {
    // Calculate number of decimal places needed to show first non-zero digit
    const decimals = match[0].length - 1; // subtract 1 for the decimal point
    return percentage.toFixed(decimals);
  }
  
  return percentage.toString();
}
