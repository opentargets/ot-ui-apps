import Papa from "papaparse";

/**
 * Test configuration interface
 * Defines the structure of test data used across E2E tests
 */
export interface TestConfig {
  drug: {
    /** Drug with comprehensive data across all sections */
    primary: string;
    alternatives?: {
      withWarnings: string;
      withAdverseEvents: string;
    };
  };
  variant: {
    /** Variant with GWAS and general data */
    primary: string;
    /** Variant with molecular structure data */
    withMolecularStructure: string;
    /** Variant with pharmacogenomics data */
    withPharmacogenomics: string;
    /** Variant with QTL data */
    withQTL?: string;
    /** Variant with EVA/ClinVar data */
    withEVA?: string;
  };
  target?: {
    primary?: string;
    alternatives?: string[];
    aotfDiseases?: string[];
  };
  disease: {
    primary: string;
    name?: string;
    alternatives?: string[];
    aotfGenes?: string[];
  };
  study: {
    gwas: {
      primary: string;
      alternatives?: string[];
    };
    qtl?: {
      primary?: string;
      alternatives?: string[];
    };
  };
}

/**
 * CSV row structure from Google Sheet
 */
interface CSVRow {
  "Scenario Name": string;
  drug_primary: string;
  drug_with_warning: string;
  drug_adverse_events: string;
  variant_primary: string;
  variant_with_molecular_structure: string;
  variant_with_pharmacogenetics: string;
  variant_with_qtl: string;
  variant_with_eva: string;
  target_primary: string;
  target_alternative: string;
  target_aotf_diseases: string;
  disease_primary: string;
  disease_name: string;
  disease_alternatives: string;
  disease_aotf_genes: string;
  study_gwas: string;
  study_qtl: string;
}

/**
 * Parse comma-separated values into an array
 */
function parseArray(value: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

/**
 * Convert a CSV row to TestConfig structure
 */
function csvRowToTestConfig(row: CSVRow): TestConfig {
  return {
    drug: {
      primary: row.drug_primary,
      alternatives: {
        withWarnings: row.drug_with_warning || row.drug_primary,
        withAdverseEvents: row.drug_adverse_events || row.drug_primary,
      },
    },
    variant: {
      primary: row.variant_primary,
      withMolecularStructure: row.variant_with_molecular_structure,
      withPharmacogenomics: row.variant_with_pharmacogenetics,
      withQTL: row.variant_with_qtl || undefined,
      withEVA: row.variant_with_eva || undefined,
    },
    target: {
      primary: row.target_primary || undefined,
      alternatives: parseArray(row.target_alternative),
      aotfDiseases: parseArray(row.target_aotf_diseases),
    },
    disease: {
      primary: row.disease_primary,
      name: row.disease_name || undefined,
      alternatives: parseArray(row.disease_alternatives),
      aotfGenes: parseArray(row.disease_aotf_genes),
    },
    study: {
      gwas: {
        primary: row.study_gwas,
        alternatives: [],
      },
      qtl: row.study_qtl
        ? {
            primary: row.study_qtl,
            alternatives: [],
          }
        : undefined,
    },
  };
}

/**
 * Fetch test configuration from Google Sheet CSV URL
 */
async function fetchConfigFromSheet(url: string, scenarioName: string): Promise<TestConfig | null> {
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
    const matchingRow = rows.find((row) => row["Scenario Name"] === scenarioName);
    if (!matchingRow) {
      console.error(
        `Scenario "${scenarioName}" not found in CSV. Available scenarios: ${rows.map((r) => r["Scenario Name"]).join(", ")}`
      );
      return null;
    }

    return csvRowToTestConfig(matchingRow);
  } catch (error) {
    console.error("Error fetching config from sheet:", error);
    return null;
  }
}

/**
 * Default test configuration (fallback)
 */
function getDefaultConfig(): TestConfig {
  return {
    drug: {
      primary: "CHEMBL1201585", // TRASTUZUMAB - has comprehensive data
      alternatives: {
        withWarnings: "CHEMBL1201585",
        withAdverseEvents: "CHEMBL1201585",
      },
    },
    variant: {
      primary: "1_154453788_C_T", // Intron variant overlapping with IL6R.
      withMolecularStructure: "19_44908822_C_T", // Missense variant overlapping with APOE, causing amino-acid change: R176C with moderate impact.
      withPharmacogenomics: "7_95308134_T_C", // PON1 variant
      withQTL: "1_154453788_C_T",
      withEVA: "19_44908822_C_T",
    },
    target: {
      primary: "ENSG00000157764", // BRAF
      alternatives: ["ENSG00000139618"], // BRCA2
    },
    disease: {
      primary: "EFO_0000612", // Myocardial infarction
      name: "myocardial infarction",
      alternatives: ["EFO_0000305", "MONDO_0007254"], // Breast carcinoma, Alzheimer disease
      aotfGenes: ["IL6", "ADRB1", "APOE"], // Genes with evidence for testing AOTF table
    },
    study: {
      gwas: {
        primary: "GCST90475211", // Example credible set study
        alternatives: [],
      },
      qtl: {
        primary: "UKB_PPP_EUR_LPA_P08519_OID30747_v1", // eQTL study
        alternatives: [],
      },
    },
  };
}

/**
 * Merge fetched config with default config, filling in empty values from default
 */
function mergeWithDefaults(fetched: TestConfig, defaults: TestConfig): TestConfig {
  return {
    drug: {
      primary: fetched.drug.primary || defaults.drug.primary,
      alternatives: {
        withWarnings:
          fetched.drug.alternatives?.withWarnings || defaults.drug.alternatives?.withWarnings || "",
        withAdverseEvents:
          fetched.drug.alternatives?.withAdverseEvents ||
          defaults.drug.alternatives?.withAdverseEvents ||
          "",
      },
    },
    variant: {
      primary: fetched.variant.primary || defaults.variant.primary,
      withMolecularStructure:
        fetched.variant.withMolecularStructure || defaults.variant.withMolecularStructure,
      withPharmacogenomics:
        fetched.variant.withPharmacogenomics || defaults.variant.withPharmacogenomics,
      withQTL: fetched.variant.withQTL || defaults.variant.withQTL,
      withEVA: fetched.variant.withEVA || defaults.variant.withEVA,
    },
    target: {
      primary: fetched.target?.primary || defaults.target?.primary,
      alternatives: fetched.target?.alternatives?.length
        ? fetched.target.alternatives
        : defaults.target?.alternatives,
      aotfDiseases: fetched.target?.aotfDiseases?.length
        ? fetched.target.aotfDiseases
        : defaults.target?.aotfDiseases,
    },
    disease: {
      primary: fetched.disease.primary || defaults.disease.primary,
      name: fetched.disease.name || defaults.disease.name,
      alternatives: fetched.disease.alternatives?.length
        ? fetched.disease.alternatives
        : defaults.disease.alternatives,
      aotfGenes: fetched.disease.aotfGenes?.length
        ? fetched.disease.aotfGenes
        : defaults.disease.aotfGenes,
    },
    study: {
      gwas: {
        primary: fetched.study.gwas.primary || defaults.study.gwas.primary,
        alternatives: fetched.study.gwas.alternatives?.length
          ? fetched.study.gwas.alternatives
          : defaults.study.gwas.alternatives,
      },
      qtl:
        fetched.study.qtl?.primary || defaults.study.qtl
          ? {
              primary: fetched.study.qtl?.primary || defaults.study.qtl?.primary,
              alternatives: fetched.study.qtl?.alternatives?.length
                ? fetched.study.qtl.alternatives
                : defaults.study.qtl?.alternatives,
            }
          : undefined,
    },
  };
}

/**
 * Cached test configuration
 */
let cachedConfig: TestConfig | null = null;

/**
 * Default configuration constants
 */
const DEFAULT_CONFIG_URL =
  "https://docs.google.com/spreadsheets/d/1oWYlb_o0AZBYOFUCd8k5-whZpKLpicZ-UyyNkLUbUk8/export?format=csv";
const DEFAULT_SCENARIO = "Target-Disease Links";

/**
 * Get test configuration (always fetches fresh)
 * Reads from environment variables TEST_CONFIG_URL and TEST_SCENARIO if available,
 * otherwise uses hardcoded defaults.
 * @returns Test configuration object
 */
export async function getTestConfig(): Promise<TestConfig> {
  // Always reset to fetch fresh config for every run
  cachedConfig = null;

  const configUrl = process.env.TEST_CONFIG_URL || DEFAULT_CONFIG_URL;
  const scenarioName = process.env.TEST_SCENARIO || DEFAULT_SCENARIO;
  const defaults = getDefaultConfig();

  if (configUrl) {
    console.log(`Fetching test config from: ${configUrl}`);
    console.log(`Using scenario: ${scenarioName}`);
    const fetchedConfig = await fetchConfigFromSheet(configUrl, scenarioName);
    if (fetchedConfig) {
      // Merge fetched config with defaults to fill any empty cells
      cachedConfig = mergeWithDefaults(fetchedConfig, defaults);
      console.log(cachedConfig);
      return cachedConfig;
    }
    console.log("Falling back to default configuration");
  }

  cachedConfig = defaults;
  return cachedConfig;
}

/**
 * Reset cached configuration (useful for testing)
 */
export function resetTestConfig(): void {
  cachedConfig = null;
}
