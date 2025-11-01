export type IGetFacilityItemRequest = {
  campusId: string
  areaId: string
  page?: number
  search?: string
  all?: boolean
}

export type IFacilityItemRequest = {
  campusId: string
  areaId: string
  name: string
}

export type IFacilityItemEditRequest = {
  name: string
}

