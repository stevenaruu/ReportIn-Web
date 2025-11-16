export type ILoginRequest = {
  campusId: string,
  token: string
}

export type IGetAllPersonRequest = {
  campusId: string
  page?: number
  search?: string
  all?: boolean
}

type IPersonRole = {
  roleId: string,
  roleName: string,
}

export type IUpdatePersonRoleRequest = {
  campusId: string,
  role: IPersonRole[]
}

export type IUpdatePersonStatusRequest = {
  campusId: string,
  status: boolean
}