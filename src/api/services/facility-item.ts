import apiClient from "@/config/api-client"
import { ApiFacilityItem } from "@/constant/ApiFacilityItem"
import { ApiFacilityItemLog } from "@/constant/ApiFacilityItemLog"
import { IFacilityItemEditRequest, IFacilityItemRequest, IGetFacilityItemRequest } from "@/types/request/facility-item"
import { IGetFacilityItemLogRequest } from "@/types/request/facility-item-log"
import type { IResponse } from "@/types/response"
import { IGetFacilityItemResponse } from "@/types/response/facility-item"
import { IGetFacilityItemLogResponse } from "@/types/response/facility-item-log"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

// Facility Item Queries
export const useGetFacilityItemQuery = (params?: IGetFacilityItemRequest) => {
  return useQuery<IResponse<IGetFacilityItemResponse[]>, Error>({
    queryKey: ["facilityItem", params],
    queryFn: async () => {
      try {
        const response = await apiClient.get<IResponse<IGetFacilityItemResponse[]>>(ApiFacilityItem.getFacilityItem, {
          params,
        })
        return response.data
      } catch (err) {
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data?.message || "Error fetching facility items")
        }
        throw new Error("Unexpected error occurred")
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  })
}

export const useGetAllFacilityItemQuery = (campusId: string, areaId: string) => {
  return useQuery<IResponse<IGetFacilityItemResponse[]>, Error>({
    queryKey: ["facilityItem", "all", campusId, areaId],
    queryFn: async () => {
      try {
        const response = await apiClient.get<IResponse<IGetFacilityItemResponse[]>>(ApiFacilityItem.getFacilityItem, {
          params: {
            campusId,
            areaId,
            all: true,
          },
        })
        return response.data
      } catch (err) {
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data?.message || "Error fetching facility items")
        }
        throw new Error("Unexpected error occurred")
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    enabled: !!campusId && !!areaId,
  })
}

// Facility Item Mutations
export const useCreateFacilityItem = () => {
  return useMutation<IResponse, Error, IFacilityItemRequest>(async (data) => {
    const response = await apiClient.post<IResponse>(ApiFacilityItem.createFacilityItem, data)
    return response.data
  })
}

export const useUpdateFacilityItem = (id: string) => {
  return useMutation<IResponse, Error, IFacilityItemEditRequest>(async (data) => {
    const response = await apiClient.put<IResponse>(ApiFacilityItem.editFacilityItem(id), data)
    return response.data
  })
}

export const useDeleteFacilityItem = () => {
  return useMutation<IResponse, Error, string>(async (id) => {
    const response = await apiClient.delete<IResponse>(ApiFacilityItem.deleteFacilityItem(id))
    return response.data
  })
}

// Facility Item Log Queries
export const useGetFacilityItemLogQuery = (params?: IGetFacilityItemLogRequest) => {
  return useQuery<IResponse<IGetFacilityItemLogResponse[]>, Error>({
    queryKey: ["facilityItemLog", params],
    queryFn: async () => {
      try {
        const response = await apiClient.get<IResponse<IGetFacilityItemLogResponse[]>>(
          ApiFacilityItemLog.getFacilityItemLog,
          { params },
        )
        return response.data
      } catch (err) {
        if (err instanceof AxiosError) {
          throw new Error(err.response?.data?.message || "Error fetching facility item logs")
        }
        throw new Error("Unexpected error occurred")
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  })
}