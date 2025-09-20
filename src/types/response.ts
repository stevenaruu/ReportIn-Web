/* eslint-disable @typescript-eslint/no-explicit-any */
type IMeta = {
  totalItems: number,
  page: number,
  pageSize: number,
  totalPages: number
}

export type IResponse<T = any> = {
  status: boolean,
  statusCode: number,
  message: string,
  data: T | null,
  meta?: IMeta
};
