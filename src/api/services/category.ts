import apiClient from "@/config/api-client";
import { ApiCategory } from "@/constant/ApiCategory";
import { IResponse } from "@/types/response";
import { IGetCategoryResponse } from "@/types/response/category";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetAllCategoryQuery = (campusId: string) => {
  return useQuery<IResponse<IGetCategoryResponse[]>, Error>({
    queryKey: ["area", "all", campusId],
    queryFn: async () => {
      try {
        const response = await apiClient.get<IResponse<IGetCategoryResponse[]>>(
          ApiCategory.getCategory, { 
            params: { 
              campusId,
              all: true 
            } 
          }
        );

        return response.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data?.message || "Error fetching areas");
        }
        throw new Error("Unexpected error occurred");
      }
    },
    staleTime: 1000 * 60 * 5, // 5 menit
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    enabled: !!campusId, // hanya jalankan query jika campusId ada
  });
};