import { ApiService } from "./ApiService";

export const ApiReport = {
  createReport: `${ApiService.report}`,
  deleteReport: (id: string) => `${ApiService.report}/${id}`,
}