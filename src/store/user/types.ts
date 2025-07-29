import { ILoginResponse } from "@/types/response/user";

export type UserState = {
  user?: ILoginResponse | null;
}