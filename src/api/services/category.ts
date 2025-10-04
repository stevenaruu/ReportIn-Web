import apiClient from "@/config/api-client";
import { ApiCategory } from "@/constant/ApiCategory";
import { ICategoryRequest, IGetCategoryRequest } from "@/types/request/category";
import { IResponse } from "@/types/response";
import { IGetCategoryResponse } from "@/types/response/category";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetCategoryQuery = (params?: IGetCategoryRequest) => {
  return useQuery<IResponse<IGetCategoryResponse[]>, Error>({
    queryKey: ["category", params],
    queryFn: async () => {
      try {
        const response = await apiClient.get<IResponse<IGetCategoryResponse[]>>(
          ApiCategory.getCategory, { params }
        );

        return response.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data?.message || "Error fetching categories");
        }
        throw new Error("Unexpected error occurred");
      }
    },
    staleTime: 1000 * 60 * 5, // 5 menit
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });
};

export const useGetAllCategoryQuery = (campusId: string) => {
  return useQuery<IResponse<IGetCategoryResponse[]>, Error>({
    queryKey: ["category", "all", campusId],
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
          throw new Error(err.response?.data?.message || "Error fetching categories");
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

export const useCreateCategory = () => {
  return useMutation<IResponse, Error, ICategoryRequest>(
    async (data) => {
      const response = await apiClient.post<IResponse>(ApiCategory.createCategory, data);
      return response.data;
    }
  );
};

export const useUpdateCategory = (id: string) => {
  return useMutation<IResponse, Error, ICategoryRequest>(
    async (data) => {
      const response = await apiClient.put<IResponse>(ApiCategory.editCategory(id), data);
      return response.data;
    }
  );
};

export const useDeleteCategory = () => {
  return useMutation<IResponse, Error, string>(
    async (id) => {
      const response = await apiClient.delete<IResponse>(ApiCategory.deleteCategory(id));
      return response.data;
    }
  );
};