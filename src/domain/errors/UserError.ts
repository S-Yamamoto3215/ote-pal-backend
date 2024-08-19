export class UserError extends Error {
  constructor(message: string, public type: UserErrorType) {
    super(message);
    this.name = "UserError";
  }

  getErrorMessage(): string {
    switch (this.type) {
      case UserErrorType.AlreadyExists:
        return this.message;
      case UserErrorType.ValidationError:
        return `Validation failed: ${this.message}`;
      default:
        return "An unknown error occurred";
    }
  }

  getStatusCode(): number {
    switch (this.type) {
      case UserErrorType.AlreadyExists:
        return 400;
      case UserErrorType.ValidationError:
        return 400;
      default:
        return 500;
    }
  }
}

export enum UserErrorType {
  AlreadyExists = "AlreadyExists",
  ValidationError = "ValidationError",
  Other = "Other",
}
