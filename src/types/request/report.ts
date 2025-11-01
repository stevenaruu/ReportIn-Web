export type ICreateReportRequest = {
  campusId: string
  complainantId: string
  complainantName: string
  complainantEmail: string
  areaId: string
  areaName: string
  categoryId: string
  categoryName: string
  description: string
  image: File
}

export type IUpdateReportStatusRequest = {
  custodianId: string
  campusId: string
  status: string
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
