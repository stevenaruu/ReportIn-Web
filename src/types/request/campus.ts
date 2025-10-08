export type ISubdomainRequest = {
  subdomain: string,
}

export type ICampusByUserIdRequest = {
  userId: string,
  page?: number;
  search?: string;
}

export interface ICreateCampusRequest {
  userId: string;
  name: string;
  mandatoryEmail: string[];
  siteName: string;
  provider: string;
  customization: {
    primaryColor: string;
  };
  logo: File;
  document: (File | undefined)[];
}

export interface IUpdateCampusRequest {
  userId: string;
  name: string;
  mandatoryEmail: string[];
  siteName: string;
  provider: string;
  customization: {
    customizationId: string;
    primaryColor: string;
  };
  logo: File;
  document: (File | undefined)[];
}