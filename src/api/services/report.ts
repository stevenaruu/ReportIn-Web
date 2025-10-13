import apiClient from "@/config/api-client";
import { ApiReport } from "@/constant/ApiReport";
import { ICreateReportRequest, IUpdateReportStatusRequest } from "@/types/request/report";
import { IResponse } from "@/types/response";
import { useMutation } from "@tanstack/react-query";

export const useCreateReportMutation = () => {
  return useMutation<IResponse, Error, ICreateReportRequest>(async (data) => {
    const formData = new FormData();
    
    formData.append("campusId", data.campusId);
    formData.append("complainantId", data.complainantId);
    formData.append("complainantName", data.complainantName);
    formData.append("complainantEmail", data.complainantEmail);
    formData.append("areaId", data.areaId);
    formData.append("areaName", data.areaName);
    formData.append("categoryId", data.categoryId);
    formData.append("categoryName", data.categoryName);
    formData.append("description", data.description);
    formData.append("image", data.image);

    const response = await apiClient.post<IResponse>(ApiReport.createReport, formData, { headers: { "Content-Type": "multipart/form-data" }, });

    return response.data;
  });
};

export const useUpdateReportMutation = () => {
  return useMutation<IResponse, Error, { id: string; data: ICreateReportRequest }>(async ({ id, data }) => {
    const formData = new FormData();
    
    formData.append("campusId", data.campusId);
    formData.append("complainantId", data.complainantId);
    formData.append("complainantName", data.complainantName);
    formData.append("complainantEmail", data.complainantEmail);
    formData.append("areaId", data.areaId);
    formData.append("areaName", data.areaName);
    formData.append("categoryId", data.categoryId);
    formData.append("categoryName", data.categoryName);
    formData.append("description", data.description);
    formData.append("image", data.image);

    const response = await apiClient.put<IResponse>(ApiReport.updateReport(id), formData, { headers: { "Content-Type": "multipart/form-data" }, });

    return response.data;
  });
};

export const useDeleteReport = () => {
  return useMutation<IResponse, Error, string>(
    async (id) => {
      const response = await apiClient.delete<IResponse>(ApiReport.deleteReport(id));
      return response.data;
    }
  );
};

export const useUpdateReportStatus = () => {
  return useMutation<IResponse, Error, { id: string; data: IUpdateReportStatusRequest }>(
    async ({ id, data }) => {
      const response = await apiClient.post<IResponse>(ApiReport.updateReportStatus(id), data);
      return response.data;
    }
  );
};