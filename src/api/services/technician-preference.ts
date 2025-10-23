import apiClient from "@/config/api-client"
import { ApiTechnicianPreference } from "@/constant/ApiTechnicianPreference"
import type { ITechnicianPreferenceRequest } from "@/types/request/technician-preference"
import type { IResponse } from "@/types/response"
import { IGetTechnicianPreferenceResponse } from "@/types/response/technician-preference"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetTechnicianPreferenceQuery = (personId: string, campusId: string) => {
  return useQuery<IResponse<IGetTechnicianPreferenceResponse>, Error>({
    queryKey: ["technician-preference", personId, campusId],
    queryFn: async () => {
      try {
        const response = await apiClient.get<IResponse<IGetTechnicianPreferenceResponse>>(
          ApiTechnicianPreference.getTechnicianPreference,
          {
            params: {
              personId,
              campusId,
            },
          },
        )
        return response.data
      } catch (err) {
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data?.message || "Error fetching technician preferences")
        }
        throw new Error("Unexpected error occurred")
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    enabled: !!personId && !!campusId,
  })
}

export const useCreateTechnicianPreference = () => {
  return useMutation<IResponse, Error, ITechnicianPreferenceRequest>(async (data) => {
    try {
      const response = await apiClient.post<IResponse>(ApiTechnicianPreference.createTechnicianPreference, data)
      return response.data
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(err.response?.data?.message || "Error creating technician preference")
      }
      throw new Error("Unexpected error occurred")
    }
  })
}
