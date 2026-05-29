import { useState, useEffect } from 'react';

interface MoleculeData {
  molecule_type: string;
  molecule_structures?: {
    canonical_smiles: string;
  };
}

export function useMolecule(chemblId: string): { smiles: string | null; isLoading: boolean; error: string | null } {
  const [smiles, setSmiles] = useState<{ smiles: string | null; isLoading: boolean; error: string | null }>({
    smiles: null,
    isLoading: true,
    error: null,
  });


  useEffect(() => {
    fetch(`https://www.ebi.ac.uk/chembl/api/data/molecule/${chemblId}?format=json`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: MoleculeData) => {
        setSmiles({
          smiles: data.molecule_type === 'Small molecule' ? data.molecule_structures?.canonical_smiles ?? null : null,
          isLoading: false,
          error: null,
        });
      })
      .catch(err => {
        console.error('Error fetching molecule data:', err);
        setSmiles({
          smiles: null,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch molecule data',
        });
      });

    return () => {};
  }, [chemblId]);

  return smiles;
}
