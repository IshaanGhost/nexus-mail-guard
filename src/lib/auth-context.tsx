import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { generateGoogleAuthUrl, exchangeCodeForToken, getGoogleUserInfo, refreshAccessToken } from './google-auth';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');

    if (savedUser && savedAccessToken) {
      setUser(JSON.parse(savedUser));
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
    }

    // Check if we're returning from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      handleOAuthCallback(code);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    try {
      setIsLoading(true);
      
      // Exchange code for tokens
      const tokenData = await exchangeCodeForToken(code);
      
      // Get user info
      const userInfo = await getGoogleUserInfo(tokenData.access_token);
      
      // Save to state and localStorage
      setUser(userInfo);
      setAccessToken(tokenData.access_token);
      setRefreshToken(tokenData.refresh_token);
      
      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('accessToken', tokenData.access_token);
      localStorage.setItem('refreshToken', tokenData.refresh_token);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('OAuth callback error:', error);
      setIsLoading(false);
    }
  };

  const signIn = () => {
    const authUrl = generateGoogleAuthUrl();
    window.location.href = authUrl;
  };

  const signOut = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    window.location.href = '/';
  };

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!refreshToken) return;

    const refreshInterval = setInterval(async () => {
      try {
        const newTokenData = await refreshAccessToken(refreshToken);
        setAccessToken(newTokenData.access_token);
        localStorage.setItem('accessToken', newTokenData.access_token);
      } catch (error) {
        console.error('Token refresh failed:', error);
        signOut();
      }
    }, 50 * 60 * 1000); // Refresh every 50 minutes

    return () => clearInterval(refreshInterval);
  }, [refreshToken]);

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isLoading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
