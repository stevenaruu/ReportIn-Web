import apiClient from "@/config/api-client";
import { ApiReport } from "@/constant/ApiReport";
import { ICreateReportRequest } from "@/types/request/report";
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