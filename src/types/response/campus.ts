export type PublicCampus = {
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

export type IPublicCampusResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: PublicCampus;
};
