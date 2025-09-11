import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBasicQuery, request } from './useApi';
import type { CreateProductRequest } from '../types/products';

export const useGetAllProducts = () => {
  return useBasicQuery({
    queryKey: ['products'],
    f: async () => {
      const response = await request('GET', '/products');
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch products');
    },
  });
};

export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: async ({ data, file }: { data: CreateProductRequest; file?: File }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('restrictions', JSON.stringify(data.restrictions));
      formData.append('sides', JSON.stringify(data.sides));
      formData.append('allowsClarifications', data.allowsClarifications.toString());
      formData.append('type', data.type);
      if (file) {
        formData.append('photo', file);
      } else if ((data as any).photo) {
        formData.append('photo', (data as any).photo);
      }
      return request('POST', '/products', formData, true);
    },
  });
};
