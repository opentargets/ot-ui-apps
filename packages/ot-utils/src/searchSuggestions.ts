import { searchSuggestions, SearchSuggestions, Suggestion } from "@ot/constants";

/**
 * Efficiently selects n random elements from an array without modifying the original.
 * Uses Fisher-Yates shuffle algorithm with early termination for optimal performance.
 */
export function selectRandomItems<T>(arr: T[], n: number): T[] {
  // Handle edge cases
  if (n <= 0) return [];
  if (n >= arr.length) return [...arr];

  // Create a copy of indices rather than the elements themselves
  const indices = Array.from({ length: arr.length }, (_, i) => i);
  const result: T[] = [];

  // Only shuffle as many elements as needed (n)
  for (let i = 0; i < n; i++) {
    // Pick a random index from the remaining indices
    const randomIndex = i + Math.floor(Math.random() * (indices.length - i));

    // Swap the current index with the randomly selected one
    const temp = indices[i];
    indices[i] = indices[randomIndex];
    indices[randomIndex] = temp;

    // Add the selected element to the result
    result.push(arr[indices[i]]);
  }

  return result;
}

export function getSuggestedSearch(): Suggestion[] {
  const suggestionArray: SearchSuggestions = searchSuggestions;
  const categories = [
    selectRandomItems(suggestionArray.targets, 2),
    selectRandomItems(suggestionArray.diseases, 2),
    selectRandomItems(suggestionArray.drugs, 2),
    selectRandomItems(suggestionArray.variants, 2),
    selectRandomItems(suggestionArray.studies, 2),
  ];
  return categories.flat();
}
