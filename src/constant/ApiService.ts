import { IApi } from "@/interfaces/IApi";

export const BASE_URL = 'http://localhost:7000';

export const ApiService: IApi = {
  user: `${BASE_URL}/user`,
  report: `${BASE_URL}/report`
}