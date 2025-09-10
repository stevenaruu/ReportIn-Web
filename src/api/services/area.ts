import apiClient from "@/config/api-client";
import { ApiPerson } from "@/constant/ApiPerson";
import { IGetAreaRequest } from "@/types/request/area";
import { IResponse } from "@/types/response";
import { IGetAreaResponse } from "@/types/response/area";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetAreaQuery = (params?: IGetAreaRequest) => {
  return useQuery<IResponse<IGetAreaResponse[]>, Error>({
    queryKey: ["area", params],
    queryFn: async () => {
      try {
        const response = await apiClient.post<IResponse<IGetAreaResponse[]>>(
          ApiPerson.allPerson,
          params
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