import { useState } from "react";

/**
 * Manages modal and pathway selection state for the enrichment map
 */
export function useEnrichmentMapState() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"node" | "edge" | null>(null);
  const [modalData, setModalData] = useState<Record<string, unknown> | null>(null);

  const [pathwaySelectionOpen, setPathwaySelectionOpen] = useState(false);
  const [selectedPathways, setSelectedPathways] = useState<{
    source: string | null;
    target: string | null;
  }>({ source: null, target: null });
  const [foundShortestPath, setFoundShortestPath] = useState(null);
  const [isComputingPath, setIsComputingPath] = useState(false);

  return {
    // Modal state
    modalOpen,
    setModalOpen,
    modalType,
    setModalType,
    modalData,
    setModalData,
    // Pathway selection state
    pathwaySelectionOpen,
    setPathwaySelectionOpen,
    selectedPathways,
    setSelectedPathways,
    foundShortestPath,
    setFoundShortestPath,
    isComputingPath,
    setIsComputingPath,
  };
}
