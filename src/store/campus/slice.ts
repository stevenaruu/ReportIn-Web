import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CampusState } from "./types";
import { IPublicCampusResponse } from "@/types/response/campus";

const initialState: CampusState = {
  campus: undefined,
};

const campusSlice = createSlice({
  name: "campus",
  initialState,
  reducers: {
  setCampus(state, action: PayloadAction<IPublicCampusResponse | null>) {
      state.campus = action.payload;
    },
  },
});

export const { setCampus } = campusSlice.actions;
export const campusReducer = campusSlice.reducer;
