/* eslint-disable @typescript-eslint/no-explicit-any */
export type IResponse<T = any> = {
  status: boolean,
  statusCode: number,
  message: string,
  data: T | null
};
