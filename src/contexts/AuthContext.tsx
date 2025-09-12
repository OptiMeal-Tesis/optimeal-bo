import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { LoginRequest, AuthState, LoginResponse } from "../types/auth";
import { tokenStorage, type TokenData } from "../utils/tokenStorage";
import { request } from "../hooks/useApi";

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // initialize from stored tokens
    const email = tokenStorage.getUserEmail();
    const hasValidTokens = tokenStorage.hasValidTokens();
    if (email && hasValidTokens) {
      setState({
        user: { email },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      tokenStorage.clearTokens();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await request<LoginResponse>(
        "POST",
        "/auth/login",
        credentials
      );
      if (response.success) {
        const tokenData: TokenData = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          idToken: response.idToken,
          email: response.data.email,
          expiresIn: response.data.expiresIn,
        };
        tokenStorage.setTokens(tokenData);
        setState({
          user: { email: response.data.email },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.message || "Credenciales inválidas");
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error?.message || "Error de autenticación",
      }));
      throw error;
    }
  };

  const logout = (): void => {
    tokenStorage.clearTokens();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const clearError = (): void => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
