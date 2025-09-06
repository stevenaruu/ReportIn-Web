import { ILoginResponse } from "@/types/response/person";
import { IPersonRole } from "@/types/role";

export type PersonState = {
  person?: ILoginResponse | null;
  personActiveRole: IPersonRole;
}