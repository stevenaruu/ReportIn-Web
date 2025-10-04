import { ApiService } from "./ApiService";

export const ApiCampus = {
  getSubdomain: `${ApiService.campus}/subdomain`,
  getAllCampusByUserId: (userId: string) => `${ApiService.campus}/all/${userId}`,
}