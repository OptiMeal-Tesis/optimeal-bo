export interface Side {
  id: number;
  name: string;
  isActive: boolean;
}

export interface ApiResult<T> {
  success: boolean;
  message: string;
  data: T;
}

export type GetSidesResponse = ApiResult<Side[]>;
export type CreateSideRequest = { name: string };
export type CreateSideResponse = ApiResult<Side>;
export type DeleteSideResponse = ApiResult<null>;
export type UpdateSideRequest = { name: string; isActive: boolean };
export type UpdateSideResponse = ApiResult<Side>;


