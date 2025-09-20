import { ApiService } from "./ApiService";

export const ApiPerson = {
  login: `${ApiService.person}`,
  allPerson: (campusId: string) => `${ApiService.person}/all/${campusId}`,
  role: `${ApiService.person}/role`
}