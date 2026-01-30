import Papa from "papaparse";
import type { CSVRow, TestConfig } from "../types";
import { csvRowToTestConfig } from "./csvRowToTestConfig";

/**
 * Fetch test configuration from Google Sheet CSV URL
 */
export async function fetchConfigFromSheet(
  url: string,
  scenarioName: string
): Promise<TestConfig | null> {
  try {
    // Add cache-busting parameter to ensure fresh data
    const cacheBustUrl = `${url}${url.includes("?") ? "&" : "?"}_t=${Date.now()}`;
    const response = await fetch(cacheBustUrl, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    if (!response.ok) {
      console.error(`Failed to fetch config from ${url}: ${response.status}`);
      return null;
    }

    const csvText = await response.text();
    const parseResult = Papa.parse<CSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (parseResult.errors.length > 0) {
      console.error("CSV parsing errors:", parseResult.errors);
    }

    const rows = parseResult.data;

    // Find the row matching the scenario name
    const matchingRow = rows.find((row) => row["Testing Scenario"] === scenarioName);
    if (!matchingRow) {
      console.error(
        `Scenario "${scenarioName}" not found in CSV. Available scenarios: ${rows.map((r) => r["Testing Scenario"]).join(", ")}`
      );
      return null;
    }

    return csvRowToTestConfig(matchingRow);
  } catch (error) {
    console.error("Error fetching config from sheet:", error);
    return null;
  }
}
