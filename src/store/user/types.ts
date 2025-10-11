import { ILoginResponse } from "@/types/response/user";
import { IUserRole } from "@/types/role";

export type UserState = {
  user?: ILoginResponse | null;
  userActiveRole: IUserRole;
}