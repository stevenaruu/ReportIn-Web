import apiClient from "@/config/api-client";
import { ApiLeaderboard } from "@/constant/ApiLeaderboard";
import { IResponse } from "@/types/response";
import { IGetLeaderboardResponse } from "@/types/response/leaderboard";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetPersonLeaderboardQuery = (campusId: string) => {
  return useQuery<IResponse<IGetLeaderboardResponse[]>, Error>({
    queryKey: ["leaderboard", campusId],
    queryFn: async () => {
      try {
         const response = await apiClient.get<IResponse<IGetLeaderboardResponse[]>>(
          ApiLeaderboard.getPerson(campusId)
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