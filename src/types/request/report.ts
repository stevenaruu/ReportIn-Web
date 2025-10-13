export type ICreateReportRequest = {
  campusId: string,
  complainantId: string,
  complainantName: string,
  complainantEmail: string,
  areaId: string,
  areaName: string,
  categoryId: string,
  categoryName: string,
  description: string,
  image: File
}

export type IUpdateReportStatusRequest = {
  status: string
  custodianId: string,
}