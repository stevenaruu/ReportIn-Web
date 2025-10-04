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

export type ICustomization = {
  customizationId: string,
  primaryColor: string,
  logo: string
}

export type IAllCampusByUserIdResponse = {
  id: string,
  userId: string,
  name: string,
  mandatoryEmail: string[],
  siteName: string,
  document: string[],
  status: string,
  comment: string,
  provider: string,
  customization: ICustomization,
  isDeleted: boolean,
  createdBy: string,
  createdDate: string,
  lastUpdatedBy: string,
  lastUpdatedDate: string,
}