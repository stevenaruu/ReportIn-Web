import { IApi } from "@/interfaces/IApi";

export const BASE_URL = 'https://api.reportin.my.id';

export const ApiService: IApi = {
  user: `${BASE_URL}/user`,
  report: `${BASE_URL}/report`,
  notification: `${BASE_URL}/notification`,
  person: `${BASE_URL}/person`,
  area: `${BASE_URL}/area`,
  campus: `${BASE_URL}/campus`,
  leaderboard: `${BASE_URL}/leaderboard`,
  category: `${BASE_URL}/category`,
  technicianPreference: `${BASE_URL}/technician-preference`,
}