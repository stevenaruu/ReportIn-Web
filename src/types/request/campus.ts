export type ISubdomainRequest = {
  subdomain: string,
}

export type ICampusByUserIdRequest = {
  userId: string,
  page?: number;
  search?: string;
}