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
    .map(v => v.trim())
    .filter(v => v.length > 0);
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
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch config from ${url}: ${response.status}`);
      return null;
    }

    const csvText = await response.text();
    const parseResult = Papa.parse<CSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim(),
    });

    if (parseResult.errors.length > 0) {
      console.error("CSV parsing errors:", parseResult.errors);
    }

    const rows = parseResult.data;

    // Find the row matching the scenario name
    const matchingRow = rows.find(row => row["Scenario Name"] === scenarioName);
    if (!matchingRow) {
      console.error(`Scenario "${scenarioName}" not found in CSV. Available scenarios: ${rows.map(r => r["Scenario Name"]).join(", ")}`);
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
 * Cached test configuration
 */
let cachedConfig: TestConfig | null = null;

/**
 * Get test configuration (with caching)
 * Reads from environment variables TEST_CONFIG_URL and TEST_SCENARIO if available,
 * otherwise falls back to default configuration.
 * @returns Test configuration object
 */
export async function getTestConfig(): Promise<TestConfig> {
  if (!cachedConfig) {
    const configUrl = process.env.TEST_CONFIG_URL;
    const scenarioName = process.env.TEST_SCENARIO || "Happy_Path_Full_Data";

    if (configUrl) {
      console.log(`Fetching test config from: ${configUrl}`);
      console.log(`Using scenario: ${scenarioName}`);
      const fetchedConfig = await fetchConfigFromSheet(configUrl, scenarioName);
      if (fetchedConfig) {
        cachedConfig = fetchedConfig;
        return cachedConfig;
      }
      console.log("Falling back to default configuration");
    }

    cachedConfig = getDefaultConfig();
  }
  return cachedConfig;
}

/**
 * Reset cached configuration (useful for testing)
 */
export function resetTestConfig(): void {
  cachedConfig = null;
}
