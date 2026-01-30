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
 * Mock function to simulate fetching config from external source
 * In real implementation, this would make an API call to retrieve test data
 */
async function fetchTestConfig(): Promise<TestConfig> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Return mock configuration
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
 * @returns Test configuration object
 */
export async function getTestConfig(): Promise<TestConfig> {
  if (!cachedConfig) {
    cachedConfig = await fetchTestConfig();
  }
  return cachedConfig;
}

/**
 * Reset cached configuration (useful for testing)
 */
export function resetTestConfig(): void {
  cachedConfig = null;
}
