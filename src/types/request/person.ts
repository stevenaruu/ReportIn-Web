export type ILoginRequest = {
  campusId: string,
  token: string
}

export type IGetAllPersonRequest = {
  campusId: string
}

type IPersonRole = {
  roleId: string,
  roleName: string,
}

export type IUpdatePersonRoleRequest = {
  campusId: string,
  role: IPersonRole[]
}