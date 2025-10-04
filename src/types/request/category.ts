export type IGetCategoryRequest = {
  campusId: string;
  page?: number;
  search?: string;
  all?: boolean;
}

export type ICategoryRequest = {
  campusId: string;
  name: string;
}