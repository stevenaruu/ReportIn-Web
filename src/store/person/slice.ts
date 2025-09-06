import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersonState } from "./types";
import { ILoginResponse } from "@/types/response/person";
import { IPersonRole } from "@/types/role";

const initialState: PersonState = {
  person: undefined,
  personActiveRole: {
    roleId: "",
    roleName: "",
    isDefault: false,
  },
};

const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    setPerson(state, action: PayloadAction<ILoginResponse | null>) {
      state.person = action.payload;
    },
    setPersonActiveRole(state, action: PayloadAction<IPersonRole>) {
      state.personActiveRole = action.payload;
    },
  },
});

export const { setPerson, setPersonActiveRole } = personSlice.actions;
export const personReducer = personSlice.reducer;
