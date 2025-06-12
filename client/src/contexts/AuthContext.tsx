import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          // First set the stored values
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Then verify token is still valid by fetching fresh profile
          try {
            const profile = await authService.getProfile();
            // Update with fresh profile data
            setUser(profile);
            localStorage.setItem('user', JSON.stringify(profile));
          } catch (error) {
            console.log('Token verification failed during initialization, clearing auth state');
            // Token invalid, clear everything
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        } else {
          // No stored auth data
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      
      setUser(response.user);
      setToken(response.token);
      
      // Store in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please check your credentials and try again.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      setUser(response.user);
      setToken(response.token);
      
      // Store in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Periodic token validation (every 5 minutes)
  useEffect(() => {
    if (!token || !user) return;

    const validateToken = async () => {
      try {
        await authService.getProfile();
      } catch (error) {
        console.log('Periodic token validation failed, logging out');
        logout();
      }
    };

    // Check token validity every 5 minutes
    const interval = setInterval(validateToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, user]);

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
