import { IPersonRole } from "../role"

export type ILoginRequest = {
  campusId: string,
  token: string
}

export type IGetAllPersonRequest = {
  campusId: string
}

export type IUpdatePersonRoleRequest = {
  personId: string,
  campusId: string,
  role: IPersonRole[]
}