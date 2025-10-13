import { ApiService } from "./ApiService";

export const ApiPerson = {
  login: `${ApiService.person}`,
  allPerson: (campusId: string) => `${ApiService.person}/all/${campusId}`,
  role: (id: string) => `${ApiService.person}/role/${id}`,
  updateStatus: (id: string) => `${ApiService.person}/status/${id}`
}