import type { IAccess } from "../model/access"

export type IPerson = {
  personId: string
  name: string
  email: string
}

export type IGetFacilityItemLogResponse = {
  id: string
  itemId: string
  person: IPerson
  issue: string
} & IAccess
