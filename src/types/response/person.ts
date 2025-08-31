import { IPersonRole } from "../role";

export type ILoginResponse = {
  id: string,
  campusId: string,
  name: string,
  email: string,
  role: IPersonRole[],
}