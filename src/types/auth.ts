// Auth interfaces
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    accessToken: string;
    refreshToken: string;
    idToken: string;
    data: {
        email: string;
        expiresIn: number;
    };
}

export interface AuthUser {
    email: string;
}

export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
