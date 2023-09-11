import { useContext } from 'react';
import AssociationsContext from '../context/AssociationsContext';

function useAotfContext() {
  return useContext(AssociationsContext);
}
export default useAotfContext;
