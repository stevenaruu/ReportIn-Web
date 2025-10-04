export type IGetAreaRequest = {
  campusId: string;
  page?: number;
  search?: string;
  all?: boolean;
}

export type IAreaRequest = {
  campusId: string;
  areaName: string;
  beaconId: string;
}