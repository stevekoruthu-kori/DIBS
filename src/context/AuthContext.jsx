import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Authentication Context for DIBS
 * Manages user login, logout, and auth state
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('dibs_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Simulate API call (replace with your actual auth logic)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with real Firebase/backend response
      const userData = {
        id: Date.now(),
        email: credentials.email || credentials.phone,
        name: credentials.name || 'User',
        avatar: '🔥',
        joinedAt: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('dibs_user', JSON.stringify(userData));
      setLoading(false);
      
      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('dibs_user');
  };

  // Sign up function
  const signup = async (credentials) => {
    return await login(credentials); // For now, same as login
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
