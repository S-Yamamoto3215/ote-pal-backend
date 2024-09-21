export const ERROR_TYPE_TO_STATUS_CODE: Record<string, number> = {
  NotFound: 404,
  ValidationError: 422,
  Unauthorized: 401,
  Forbidden: 403,
  InternalServerError: 500,
};
