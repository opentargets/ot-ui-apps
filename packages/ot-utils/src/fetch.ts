export async function safeFetch(
  url: string,
  parseAs: "text" | "json" | null = null,
  options: RequestInit = {}
) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    return [(parseAs ? (await response[parseAs]()) : response), undefined];
  } catch (error) {
    return [undefined, error];
  }
}