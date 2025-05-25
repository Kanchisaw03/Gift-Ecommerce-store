import { useContext } from 'react';
import SuperAdminContext from '../context/SuperAdminContext';

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  
  if (!context) {
    throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
  }
  
  return context;
};

export default useSuperAdmin;
