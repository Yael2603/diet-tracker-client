export type Role = "USER" | "ADMIN";

export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: ErrorDetail[];
}
