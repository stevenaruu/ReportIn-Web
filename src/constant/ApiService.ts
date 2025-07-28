import { IApi } from "@/interfaces/IApi";

export const BASE_URL = 'https://report-in-api.vercel.app';

export const ApiService: IApi = {
  user: `${BASE_URL}/user`,
  report: `${BASE_URL}/report`,
  notification: `${BASE_URL}/notification`
}