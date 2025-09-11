import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Surface backend error messages consistently
        const message = error?.response?.data?.message || error.message || 'Request failed';
        return Promise.reject(new Error(message));
    }
);

export default http;


