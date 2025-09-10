import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiService.getAllProducts();
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
