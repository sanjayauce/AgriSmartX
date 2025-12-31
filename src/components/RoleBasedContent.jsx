import { useAuth } from '../context/AuthContext';

const RoleBasedContent = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== 'Farmer') {
    return null; // Return nothing for non-farmer roles
  }

  return children;
};

export default RoleBasedContent; 