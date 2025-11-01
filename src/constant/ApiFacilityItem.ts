import { ApiService } from "./ApiService"

export const ApiFacilityItem = {
  getFacilityItem: `${ApiService.facilityItem}/all`,
  createFacilityItem: `${ApiService.facilityItem}`,
  editFacilityItem: (id: string) => `${ApiService.facilityItem}/${id}`,
  deleteFacilityItem: (id: string) => `${ApiService.facilityItem}/${id}`,
}
