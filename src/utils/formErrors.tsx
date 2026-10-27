import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ApiError } from "../types/common";

export function showServerErrors<T extends FieldValues>(error: ApiError, setError: UseFormSetError<T>) {
  if (error.details) {
    error.details.forEach((detail) => {
      setError(detail.field as Path<T>, { message: detail.message });
    });
    return;
  }
  setError("root", { message: error.message });
}
