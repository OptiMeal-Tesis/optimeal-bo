import { tokenStorage } from '../utils/tokenStorage';
import type { LoginRequest, LoginResponse } from '../types/auth';
import type { ProductListResponse } from '../types/products';

class ApiService {
    private baseURL: string;

    constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        // Get access token for authenticated requests
        const accessToken = tokenStorage.getAccessToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        // Add authorization header if token exists
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const config: RequestInit = {
            headers,
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        return this.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async getAllProducts(): Promise<ProductListResponse> {
        return this.request<ProductListResponse>('/products', {
            method: 'GET',
        });
    }
}

export const apiService = new ApiService();
