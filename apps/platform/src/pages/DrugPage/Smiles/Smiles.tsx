import { Skeleton } from '@mui/material';
import { useMolecule } from './useMolecule';
import SmilesHelper from './SmilesHelper';

interface SmilesProps {
  chemblId: string;
}

export default function Smiles({ chemblId }: SmilesProps): JSX.Element | null {

  const { smiles, isLoading, error } = useMolecule(chemblId);

  if (error || (smiles === null && !isLoading)) {
    return null;
  }

  if (isLoading || smiles === null) {
    return <Skeleton style={{ marginLeft: 'auto' }} height="240px" variant='rectangular' width="450px" />;
  }

  return <SmilesHelper chemblId={chemblId} smiles={smiles} />;
}
