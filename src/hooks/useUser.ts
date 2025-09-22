import { useBasicQuery, request } from "./useApi";

export const useGetCurrentUser = () => {
  return useBasicQuery({
    queryKey: ["currentUser"],
    f: async () => {
      const response = await request("GET", "/users/me");
      return response.data;
    },
  });
};