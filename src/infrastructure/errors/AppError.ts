import { ERROR_TYPE_TO_STATUS_CODE } from "@/infrastructure/errors/errorTypes";

export class AppError extends Error {
  public statusCode: number;
  public errorType: string;

  constructor(errorType: string, message: string) {
    super(message);
    this.errorType = errorType;
    this.statusCode = ERROR_TYPE_TO_STATUS_CODE[errorType] || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}
