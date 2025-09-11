import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosError, Method } from 'axios';
import http from '../services/http';

export function request<ResponseData = any>(
    verb: Method,
    url: string,
    data?: any,
    isFormData?: boolean
): Promise<ResponseData> {
    if (verb.toLowerCase() === 'get') {
        return http({ method: verb, url, params: data }).then(r => r.data);
    }
    return http({
        method: verb,
        url,
        data,
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    }).then(r => r.data);
}

export function useBasicQuery<ResponseData = any>({
    queryKey,
    f,
    enabled = true,
    options,
}: {
    queryKey: unknown[];
    f: () => Promise<ResponseData>;
    enabled?: boolean;
    options?: any;
}) {
    return useQuery<ResponseData, AxiosError<{ message?: string }>>({
        queryKey,
        queryFn: f,
        enabled,
        refetchOnWindowFocus: false,
        ...options,
    });
}

export function useBasicMutation<ResponseData = any, TVariables = any>({ f }: { f: (vars: TVariables) => Promise<ResponseData> }) {
    return useMutation<ResponseData, AxiosError, TVariables>({
        mutationFn: f,
    });
}


