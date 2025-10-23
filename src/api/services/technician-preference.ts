import apiClient from "@/config/api-client"
import { ApiTechnicianPreference } from "@/constant/ApiTechnicianPreference"
import { ITechnicianPreferenceRequest } from "@/types/request/technician-preference"
import type { IResponse } from "@/types/response"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

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
