import apiClient from "@/config/api-client";
import { ApiPerson } from "@/constant/ApiPerson";
import { ILoginRequest, IUpdatePersonRoleRequest } from "@/types/request/person";
import { IResponse } from "@/types/response";
import { IGetAllPersonResponse, ILoginResponse } from "@/types/response/person";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useLoginMutation = () => {
  return useMutation<IResponse<ILoginResponse>, Error, ILoginRequest>(
    async (data) => {
      const response = await apiClient.post<IResponse<ILoginResponse>>(ApiPerson.login, data);
      return response.data;
    }
  );
};

export const useUpdatePersonRole = () => {
  return useMutation<IResponse, Error, IUpdatePersonRoleRequest>(
    async (data) => {
      const response = await apiClient.post<IResponse>(ApiPerson.role, data);
      return response.data;
    }
  );
};

export const useGetAllPersonQuery = (id: string) => {
  return useQuery<IResponse<IGetAllPersonResponse[]>, Error>({
    queryKey: ["all-person", id],
    queryFn: async () => {
      try {
        const response = await apiClient.get<IResponse<IGetAllPersonResponse[]>>(
          ApiPerson.allPerson(id)
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
  });
};
