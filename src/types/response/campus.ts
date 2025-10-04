export type IPublicCampusResponse = {
  campusId: string;
  name: string;
  mandatoryEmail: string[];
  siteName: string;
  provider: string;
  customization: {
    customizationId: string;
    primaryColor: string;
    logo: string;
  };
}

export type IAllCampusByUserIdResponse = {
  id: string,
  name: string,
  siteName: string,
  status: string
}