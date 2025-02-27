import { useQuery } from "@tanstack/react-query";
import apiClient from "@/config/api-client";
import { API_ENDPOINTS } from "../endpoints";
import { AxiosError } from "axios";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.USERS);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data || "Error fetching users");
        }
        throw new Error("Unexpected error occurred");
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2, // Retry failed requests
    refetchOnWindowFocus: false, // Avoid refetching on window focus
  });
};
