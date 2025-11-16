import { ApiService } from "./ApiService";

export const ApiPerson = {
  login: `${ApiService.person}`,
  allPerson: () => `${ApiService.person}/all`,
  role: (id: string) => `${ApiService.person}/role/${id}`,
  updateStatus: (id: string) => `${ApiService.person}/status/${id}`
}