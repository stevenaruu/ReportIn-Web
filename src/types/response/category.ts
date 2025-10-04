import { IAccess } from "../model/access";

export type IGetCategoryResponse = {
  id: string,
  name: string,
  campusId: string,
} & IAccess;