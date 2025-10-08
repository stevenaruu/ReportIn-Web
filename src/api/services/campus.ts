import apiClient from "@/config/api-client";
import { ApiCampus } from "@/constant/ApiCampus";
import { ICampusByUserIdRequest, ICreateCampusRequest, ISubdomainRequest, IUpdateCampusRequest } from "@/types/request/campus";
import { IResponse } from "@/types/response";
import { IAllCampusByUserIdResponse, IPublicCampusResponse } from "@/types/response/campus";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
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
  params: ICampusByUserIdRequest,
  options?: UseQueryOptions<IResponse<IAllCampusByUserIdResponse[]>, Error>
) => {
  return useQuery<IResponse<IAllCampusByUserIdResponse[]>, Error>({
    queryKey: ["campus", params],
    queryFn: async () => {
      try {
        const response = await apiClient.get<IResponse<IAllCampusByUserIdResponse[]>>(
          ApiCampus.getAllCampusByUserId(params.userId),
          { params: { page: params.page, search: params.search } }
        );
        return response.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data?.message || "Error fetching campus");
        }
        throw new Error("Unexpected error occurred");
      }
    },
    enabled: options?.enabled ?? !!params.userId,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    ...options,
  });
};

export const useDeleteCampus = () => {
  return useMutation<IResponse, Error, string>(
    async (id) => {
      const response = await apiClient.delete<IResponse>(ApiCampus.deleteCampus(id));
      return response.data;
    }
  );
};

export const useCreateCampusMutation = () => {
  return useMutation<IResponse, Error, ICreateCampusRequest>(async (data) => {
    const formData = new FormData();
    formData.append("userId", data.userId);
    formData.append("name", data.name);
    formData.append("mandatoryEmail", JSON.stringify(data.mandatoryEmail));
    formData.append("siteName", data.siteName);
    formData.append("provider", data.provider);
    formData.append("customization", JSON.stringify(data.customization));
    formData.append("logo", data.logo);
    data.document.filter(Boolean).forEach((doc) => {
      formData.append("document", doc!);
    });
    const response = await apiClient.post<IResponse>(ApiCampus.createCampus(), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  });
};

export const useUpdateCampusMutation = () => {
  return useMutation<IResponse, Error, { id: string; data: IUpdateCampusRequest }>(async ({ id, data }) => {
    const formData = new FormData();
    formData.append("userId", data.userId);
    formData.append("name", data.name);
    formData.append("mandatoryEmail", JSON.stringify(data.mandatoryEmail));
    formData.append("siteName", data.siteName);
    formData.append("provider", data.provider);
    formData.append("customization", JSON.stringify(data.customization));
    formData.append("logo", data.logo);
    data.document.filter(Boolean).forEach((doc) => {
      formData.append("document", doc!);
    });
    const response = await apiClient.post<IResponse>(ApiCampus.updateCampus(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  });
};