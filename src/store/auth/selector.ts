import { RootState } from "@/store";

export const selectUsername = (state: RootState) => state.auth.username;
