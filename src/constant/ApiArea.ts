import { ApiService } from "./ApiService";

export const ApiArea = {
  getArea: `${ApiService.area}/all`,
  createArea: `${ApiService.area}`,
  editArea: (id: string) => `${ApiService.area}/${id}`,
  deleteArea: (id: string) => `${ApiService.area}/${id}`,
}