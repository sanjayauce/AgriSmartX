import React, { createContext, useContext, useEffect, useState } from 'react';

// Create the context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ On mount: check session storage for existing user
  useEffect(() => {
    const storedUserRole = sessionStorage.getItem('userRole');
    const storedUserEmail = sessionStorage.getItem('userEmail');
    const storedUserId = sessionStorage.getItem('userId');
    const storedUserRoleId = sessionStorage.getItem('userRoleId');

    if (storedUserRole && storedUserEmail && storedUserId && storedUserRoleId) {
      setUser({
        id: storedUserId,
        role: storedUserRole,
        email: storedUserEmail,
        roleId: storedUserRoleId,
      });
    }

    setLoading(false);
  }, []);

  // ✅ Login — store in sessionStorage
  const login = (userData) => {
    sessionStorage.setItem('userRole', userData.role);
    sessionStorage.setItem('userEmail', userData.email);
    sessionStorage.setItem('userId', userData.id);
    sessionStorage.setItem('userRoleId', userData.roleId); // Store roleId
    setUser(userData);
  };

  // ✅ Logout — clear sessionStorage
  const logout = () => {
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userRoleId');
    setUser(null);
  };

  if (loading) {
    return null; // or a loader
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
