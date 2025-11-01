import type { IAccess } from "../model/access"

export type IGetFacilityItemResponse = {
  id: string
  campusId: string
  areaId: string
  name: string
} & IAccess
