import { ApiService } from "./ApiService";

export const ApiLeaderboard = {
  getPerson: (campusId: string) => `${ApiService.leaderboard}/${campusId}`
}