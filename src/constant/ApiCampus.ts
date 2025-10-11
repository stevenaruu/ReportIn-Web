import { ApiService } from "./ApiService";

export const ApiCampus = {
  getSubdomain: `${ApiService.campus}/subdomain`,
  getAllCampusByUserId: (userId: string) => `${ApiService.campus}/all/${userId}`,
  getAllCampus: () => `${ApiService.campus}/all`,
  deleteCampus: (id: string) => `${ApiService.campus}/${id}`,
  createCampus: () => `${ApiService.campus}`,
  updateCampus: (id: string) => `${ApiService.campus}/${id}`,
  verifyCampus: () => `${ApiService.campus}/verify`,
}