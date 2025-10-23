import { createContext, useContext, useState, useEffect } from 'react';
import { getUserPermissions } from '../api/userApi';

const PermissionContext = createContext([]);

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await getUserPermissions();
      
        if (data && Array.isArray(data.permissions)) {
          setPermissions(data.permissions);
        
        } else {
          setPermissions([]);
        }
      } catch (err) {
       
        setPermissions([]);
      }
    };

    fetchPermissions();
  }, []);

  return (
    <PermissionContext.Provider value={permissions}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  return Array.isArray(context) ? context : [];
};