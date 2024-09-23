import { AppError } from "@/infrastructure/errors/AppError";
import { ERROR_TYPE_TO_STATUS_CODE } from "@/infrastructure/errors/errorTypes";

describe('AppError', () => {
  it('should create an instance of AppError with the correct properties', () => {
    const errorType = 'NOT_FOUND';
    const message = 'Resource not found';
    const statusCode = ERROR_TYPE_TO_STATUS_CODE[errorType] || 500;

    const appError = new AppError(errorType, message);

    expect(appError).toBeInstanceOf(AppError);
    expect(appError.message).toBe(message);
    expect(appError.errorType).toBe(errorType);
    expect(appError.statusCode).toBe(statusCode);
    expect(appError.stack).toBeDefined();
  });

  it('should default to status code 500 if error type is not in ERROR_TYPE_TO_STATUS_CODE', () => {
    const errorType = 'UNKNOWN_ERROR';
    const message = 'An unknown error occurred';

    const appError = new AppError(errorType, message);

    expect(appError.statusCode).toBe(500);
  });
});
