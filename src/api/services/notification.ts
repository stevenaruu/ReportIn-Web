import apiClient from "@/config/api-client";
import { ApiNotification } from "@/constant/ApiNotification";
import { ICreateNotificationRequest } from "@/types/request/notification";
import { IResponse } from "@/types/response";
import { useMutation } from "@tanstack/react-query";

export const useCreateNotificationMutation = () => {
  return useMutation<IResponse, Error, ICreateNotificationRequest>(
    async (data) => {
      const response = await apiClient.post<IResponse>(ApiNotification.createNotificationToken, data);
      return response.data;
    }
  );
};