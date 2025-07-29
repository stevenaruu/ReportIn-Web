import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "./types";
import { ILoginResponse } from "@/types/response/user";

const initialState: UserState = {
  user: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  setUser(state, action: PayloadAction<ILoginResponse | null>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
