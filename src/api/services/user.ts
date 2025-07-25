import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/config/api-client";
import { AxiosError } from "axios";
import { ApiUser } from "@/constant/ApiUser";
import { ILoginResponse } from "@/types/response/user";
import { ILoginRequest } from "@/types/request/user";
import { IResponse } from "@/types/response";

export const useLoginMutation = () => {
  return useMutation<IResponse<ILoginResponse>, Error, ILoginRequest>(
    async (data) => {
      const response = await apiClient.post<IResponse<ILoginResponse>>(ApiUser.login, data);
      return response.data;
    }
  );
};

export const useUsers = () => {
  return useQuery<ILoginResponse, Error>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<ILoginResponse>(ApiUser.login);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data || "Error fetching users");
        }
        throw new Error("Unexpected error occurred");
      }
    },
    staleTime: 1000 * 60 * 5, 
    retry: 3, 
    refetchOnWindowFocus: false,
  });
};
