import { useQueryClient } from '@tanstack/react-query';
import { useBasicMutation, useBasicQuery, request } from './useApi';
import type {
  CreateSideRequest,
  CreateSideResponse,
  DeleteSideResponse,
  GetSidesResponse,
  UpdateSideRequest,
  UpdateSideResponse,
} from '../types/sides';

const SIDES_KEY = ['sides'];

export const useGetAllSides = () =>
  useBasicQuery<GetSidesResponse>({
    queryKey: SIDES_KEY,
    f: async () => request('GET', '/sides'),
  });

export const useGetActiveSides = () =>
  useBasicQuery<GetSidesResponse>({
    queryKey: [...SIDES_KEY, 'active'],
    f: async () => request('GET', '/sides/active'),
  });

export const useCreateSide = () =>
  useBasicMutation<CreateSideResponse, CreateSideRequest>({
    f: async (data) => request('POST', '/sides', data),
  });

export const useDeleteSide = () =>
  useBasicMutation<DeleteSideResponse, { id: number }>({
    f: async ({ id }) => request('DELETE', `/sides/${id}`),
  });

export const useUpdateSide = () =>
  useBasicMutation<UpdateSideResponse, { id: number; data: UpdateSideRequest }>({
    f: async ({ id, data }) => request('PUT', `/sides/${id}`, data),
  });

export const useInvalidateSides = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: SIDES_KEY });
    queryClient.invalidateQueries({ queryKey: [...SIDES_KEY, 'active'] });
  };
};


