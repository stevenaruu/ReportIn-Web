export type ICreateReportRequest = {
  campusId: string
  facilityUserId: string
  facilityUserName: string
  facilityUserEmail: string
  areaId: string
  areaName: string
  categoryId: string
  categoryName: string
  description: string
  image: File
}

export type IUpdateReportStatusRequest = {
  technicianId: string
  campusId: string
  status: string
  issue?: string
  itemId?: string
  difficulty?: number
}

export type IExportReportRequest = {
  startDate: string // format: YYYY-MM-DD
  endDate: string // format: YYYY-MM-DD
  campusId: string
}

export type IUpvoteReportRequest = {
  reportId: string
  personId: string
}

export type IDeleteReportRequest = {
  deletionRemark: string
}