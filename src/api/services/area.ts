import apiClient from "@/config/api-client";
import { ApiArea } from "@/constant/ApiArea";
import { IAreaRequest, IGetAreaRequest } from "@/types/request/area";
import { IResponse } from "@/types/response";
import { IGetAreaResponse } from "@/types/response/area";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetAreaQuery = (params?: IGetAreaRequest) => {
  return useQuery<IResponse<IGetAreaResponse[]>, Error>({
    queryKey: ["area", params],
    queryFn: async () => {
      try {
        const response = await apiClient.get<IResponse<IGetAreaResponse[]>>(
          ApiArea.getArea, { params }
        );

        return response.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data?.message || "Error fetching persons");
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

export const useGetAllAreaQuery = (campusId: string) => {
  return useQuery<IResponse<IGetAreaResponse[]>, Error>({
    queryKey: ["area", "all", campusId],
    queryFn: async () => {
      try {
        const response = await apiClient.get<IResponse<IGetAreaResponse[]>>(
          ApiArea.getArea, { 
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

export const useCreateArea = () => {
  return useMutation<IResponse, Error, IAreaRequest>(
    async (data) => {
      const response = await apiClient.post<IResponse>(ApiArea.createArea, data);
      return response.data;
    }
  );
};

export const useUpdateArea = (id: string) => {
  return useMutation<IResponse, Error, IAreaRequest>(
    async (data) => {
      const response = await apiClient.put<IResponse>(ApiArea.editArea(id), data);
      return response.data;
    }
  );
};

export const useDeleteArea = () => {
  return useMutation<IResponse, Error, string>(
    async (id) => {
      const response = await apiClient.delete<IResponse>(ApiArea.deleteArea(id));
      return response.data;
    }
  );
};