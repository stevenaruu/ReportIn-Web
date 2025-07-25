import { IUserRole } from "../role";

export type ILoginResponse = {
  id: string,
  name: string,
  email: string,
  role: IUserRole[],
}