import { ApiService } from "./ApiService"

export const ApiReport = {
  createReport: `${ApiService.report}`,
  updateReport: (id: string) => `${ApiService.report}/${id}`,
  deleteReport: (id: string) => `${ApiService.report}/${id}`,
  updateReportStatus: (id: string) => `${ApiService.report}/status/${id}`,
  exportReport: `${ApiService.report}/export`,
  upvote: `${ApiService.report}/upvote`,
}
