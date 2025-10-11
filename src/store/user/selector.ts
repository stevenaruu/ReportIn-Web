import { RootState } from "@/store";

export const selectUser = (state: RootState) => state.user.user;
export const selectUserActiveRole = (state: RootState) => state.user.userActiveRole;
