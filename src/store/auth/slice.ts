import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "./types";

const initialState: AuthState = {
  username: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  setUsername(state, action: PayloadAction<string | null | undefined>) {
      state.username = action.payload;
    },
  },
});

export const { setUsername } = authSlice.actions;
export const authReducer = authSlice.reducer;
