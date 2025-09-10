import { tokenStorage } from '../utils/tokenStorage';
import type { LoginRequest, LoginResponse } from '../types/auth';
import type { ProductListResponse, CreateProductRequest, CreateProductResponse } from '../types/products';

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

    private async requestWithFormData<T>(
        endpoint: string,
        formData: FormData,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        // Get access token for authenticated requests
        const accessToken = tokenStorage.getAccessToken();
        const headers: Record<string, string> = {};

        // Add authorization header if token exists
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const config: RequestInit = {
            method: 'POST',
            headers,
            body: formData,
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                // Create a custom error that preserves the full response
                const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
                (error as any).response = errorData;
                (error as any).status = response.status;
                throw error;
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

    async createProduct(productData: CreateProductRequest, file?: File): Promise<CreateProductResponse> {
        const formData = new FormData();
        
        // Add all product data to FormData
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price.toString());
        formData.append('restrictions', JSON.stringify(productData.restrictions));
        formData.append('sides', JSON.stringify(productData.sides));
        formData.append('allowsClarifications', productData.allowsClarifications.toString());
        formData.append('type', productData.type);
        
        // Add photo if provided
        if (file) {
            formData.append('photo', file);
        } else if (productData.photo) {
            formData.append('photo', productData.photo);
        }

        return this.requestWithFormData<CreateProductResponse>('/products', formData);
    }
}

export const apiService = new ApiService();
