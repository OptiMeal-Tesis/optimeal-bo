import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth';
import type { LoginRequest, AuthState, AuthUser } from '../services';

export interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>(authService.getState());

    useEffect(() => {
        const unsubscribe = authService.subscribe((newState) => {
            setState(newState);
        });

        return unsubscribe;
    }, []);

    const login = async (credentials: LoginRequest): Promise<void> => {
        return authService.login(credentials);
    };

    const logout = (): void => {
        authService.logout();
    };

    const clearError = (): void => {
        authService.clearError();
    };

    const value: AuthContextType = {
        ...state,
        login,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
