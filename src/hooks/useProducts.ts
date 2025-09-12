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

export const useInvalidateProductsQueryKey = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };
};

export const useInvalidateProductQueryKey = () => {
  const queryClient = useQueryClient();
  
  return (productId: string) => {
    queryClient.invalidateQueries({ queryKey: ['product', productId] });
  };
};

export const useGetProductById = (id: string) => {
  return useBasicQuery({
    queryKey: ['product', id],
    f: async () => {
      const response = await request('GET', `/products/${id}`);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch product');
    },
    enabled: !!id,
  });
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

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: async ({ id, data, file }: { id: string; data: CreateProductRequest; file?: File }) => {
      if (file) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('restrictions', JSON.stringify(data.restrictions));
        formData.append('sides', JSON.stringify(data.sides));
        formData.append('allowsClarifications', data.allowsClarifications.toString());
        formData.append('type', data.type);
        formData.append('stock', data.stock.toString());
        formData.append('photo', file);
        
        return request('PUT', `/products/${id}`, formData, true);
      } else {
        const requestData = {
          name: data.name,
          description: data.description,
          price: data.price,
          restrictions: data.restrictions,
          sides: data.sides,
          allowsClarifications: data.allowsClarifications,
          type: data.type,
          stock: data.stock,
        };
        return request('PUT', `/products/${id}`, requestData, false);
      }
    },
  });
};
