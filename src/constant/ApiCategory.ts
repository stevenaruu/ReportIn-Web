import { ApiService } from "./ApiService";

export const ApiCategory = {
  getCategory: `${ApiService.category}`,
  createCategory: `${ApiService.category}`,
  editCategory: (id: string) => `${ApiService.category}/${id}`,
  deleteCategory: (id: string) => `${ApiService.category}/${id}`,
}