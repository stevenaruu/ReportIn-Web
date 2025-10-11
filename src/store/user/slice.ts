import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "./types";
import { ILoginResponse } from "@/types/response/user";
import { IUserRole } from "@/types/role";

const initialState: UserState = {
  user: undefined,
  userActiveRole: {
    roleId: "",
    roleName: "",
    isDefault: false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<ILoginResponse | null>) {
      state.user = action.payload;
    },
    setUserActiveRole(state, action: PayloadAction<IUserRole>) {
      state.userActiveRole = action.payload;
    },
  },
});

export const { setUser, setUserActiveRole } = userSlice.actions;
export const userReducer = userSlice.reducer;
