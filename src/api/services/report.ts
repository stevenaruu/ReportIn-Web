import apiClient from "@/config/api-client"
import { ApiReport } from "@/constant/ApiReport"
import type {
  ICreateReportRequest,
  IExportReportRequest,
  IUpdateReportStatusRequest,
  IUpvoteReportRequest,
  IDeleteReportRequest,
} from "@/types/request/report"
import type { IResponse } from "@/types/response"
import { useMutation } from "@tanstack/react-query"

export const useCreateReportMutation = () => {
  return useMutation<IResponse, Error, ICreateReportRequest>(async (data) => {
    const formData = new FormData()

    formData.append("campusId", data.campusId)
    formData.append("facilityUserId", data.facilityUserId)
    formData.append("facilityUserName", data.facilityUserName)
    formData.append("facilityUserEmail", data.facilityUserEmail)
    formData.append("areaId", data.areaId)
    formData.append("areaName", data.areaName)
    formData.append("categoryId", data.categoryId)
    formData.append("categoryName", data.categoryName)
    formData.append("description", data.description)
    formData.append("image", data.image)

    const response = await apiClient.post<IResponse>(ApiReport.createReport, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    return response.data
  })
}

export const useUpdateReportMutation = () => {
  return useMutation<IResponse, Error, { id: string; data: ICreateReportRequest }>(async ({ id, data }) => {
    const formData = new FormData()

    formData.append("campusId", data.campusId)
    formData.append("facilityUserId", data.facilityUserId)
    formData.append("facilityUserName", data.facilityUserName)
    formData.append("facilityUserEmail", data.facilityUserEmail)
    formData.append("areaId", data.areaId)
    formData.append("areaName", data.areaName)
    formData.append("categoryId", data.categoryId)
    formData.append("categoryName", data.categoryName)
    formData.append("description", data.description)
    formData.append("image", data.image)

    const response = await apiClient.put<IResponse>(ApiReport.updateReport(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    return response.data
  })
}

export const useDeleteReport = () => {
  return useMutation<IResponse, Error, { id: string; data: IDeleteReportRequest }>(async ({ id, data }) => {
    const response = await apiClient.delete<IResponse>(ApiReport.deleteReport(id), {
      data,
    })
    return response.data
  })
}

export const useUpdateReportStatus = () => {
  return useMutation<IResponse, Error, { id: string; data: IUpdateReportStatusRequest }>(async ({ id, data }) => {
    const response = await apiClient.post<IResponse>(ApiReport.updateReportStatus(id), data)
    return response.data
  })
}

export const useExportReportMutation = () => {
  return useMutation<Blob, Error, IExportReportRequest>(async (data) => {
    const response = await apiClient.post(ApiReport.exportReport, data, {
      responseType: "blob",
      headers: { "Content-Type": "application/json" },
    })
    return response.data as Blob
  })
}

export const useUpvoteReportMutation = () => {
  return useMutation<IResponse, Error, IUpvoteReportRequest>(async (data) => {
    const response = await apiClient.post<IResponse>(ApiReport.upvote, data)
    return response.data
  })
}