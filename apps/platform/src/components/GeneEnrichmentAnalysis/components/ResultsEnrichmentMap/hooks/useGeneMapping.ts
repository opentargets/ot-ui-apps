import { useEffect, useState, useRef } from "react";
import { useApolloClient } from "@apollo/client";
import { buildGeneToTargetIdMapping } from "../utils";

/**
 * Manages gene symbol to target ID mapping
 */
export function useGeneMapping(genes: { symbol: string }[] | undefined) {
  const apolloClient = useApolloClient();
  const [geneToTargetIdMapping, setGeneToTargetIdMapping] = useState<Map<string, string>>(
    new Map()
  );
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const buildMapping = async () => {
      if (!apolloClient || !genes || genes.length === 0) return;

      const geneSymbols = genes.map((g) => g.symbol);
      const mapping = await buildGeneToTargetIdMapping(apolloClient, geneSymbols);
      if (isMountedRef.current) {
        console.log("[GENE_MAPPING] Final gene to target ID mapping:", mapping);
        setGeneToTargetIdMapping(mapping);
      }
    };

    buildMapping();
  }, [apolloClient, genes]);

  return geneToTargetIdMapping;
}
