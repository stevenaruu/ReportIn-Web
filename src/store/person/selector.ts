import { RootState } from "@/store";

export const selectPerson = (state: RootState) => state.person.person;
export const selectPersonActiveRole = (state: RootState) => state.person.personActiveRole;