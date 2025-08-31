import apiClient from "@/config/api-client";
import { ApiPerson } from "@/constant/ApiPerson";
import { ILoginRequest } from "@/types/request/person";
import { IResponse } from "@/types/response";
import { ILoginResponse } from "@/types/response/person";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation<IResponse<ILoginResponse>, Error, ILoginRequest>(
    async (data) => {
      const response = await apiClient.post<IResponse<ILoginResponse>>(ApiPerson.login, data);
      return response.data;
    }
  );
};