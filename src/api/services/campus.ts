import apiClient from "@/config/api-client";
import { ApiCampus } from "@/constant/ApiCampus";
import { ISubdomainRequest } from "@/types/request/campus";
import { IResponse } from "@/types/response";
import { IAllCampusByUserIdResponse, IPublicCampusResponse } from "@/types/response/campus";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetCampusBySubDomain = (
  payload: ISubdomainRequest,
  options?: UseQueryOptions<IResponse<IPublicCampusResponse>, Error>
) => {
  return useQuery<IResponse<IPublicCampusResponse>, Error>({
    queryKey: ["campus", payload.subdomain],
    queryFn: async () => {
      try {
        const response = await apiClient.post<IResponse<IPublicCampusResponse>>(
          ApiCampus.getSubdomain,
          payload
        );
        return response.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data?.message || "Error fetching campus");
        }
        throw new Error("Unexpected error occurred");
      }
    },
    enabled: options?.enabled ?? false,
    staleTime: 1000 * 60 * 5,
    retry: 0,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetAllCampusByUserId = (
  userId: string,
  options?: UseQueryOptions<IResponse<IAllCampusByUserIdResponse[]>, Error>
) => {
  return useQuery<IResponse<IAllCampusByUserIdResponse[]>, Error>({
    queryKey: ["campus", userId],
    queryFn: async () => {
      try {
        const response = await apiClient.post<IResponse<IAllCampusByUserIdResponse[]>>(
          ApiCampus.getAllCampusByUserId(userId)
        );
        return response.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data?.message || "Error fetching campus");
        }
        throw new Error("Unexpected error occurred");
      }
    },
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
    ...options,
  });
};