import { IPersonRole } from "../role";

export type ILoginResponse = {
  id: string,
  campusId: string,
  name: string,
  email: string,
  role: IPersonRole[],
}

export type IGetAllPersonResponse = {
  id: string,
  campusId: string,
  name: string,
  role: IPersonRole[],
  email: string,
  createdBy: string,
  createdDate: string,
  lastUpdatedBy: string,
  lastUpdatedDate: string
}