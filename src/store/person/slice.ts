import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersonState } from "./types";
import { ILoginResponse } from "@/types/response/person";

const initialState: PersonState = {
  person: undefined,
};

const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
  setPerson(state, action: PayloadAction<ILoginResponse | null>) {
      state.person = action.payload;
    },
  },
});

export const { setPerson } = personSlice.actions;
export const personReducer = personSlice.reducer;
