import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";
import { AppError } from "@/infrastructure/errors/AppError";
import * as classValidator from "class-validator";

describe("EmailVerificationToken Entity", () => {
  const validParams = {
    token: "test-token-123",
    expiresAt: new Date(Date.now() + 3600000), // 1 hour later
    userId: 1,
  };

  describe("constructor", () => {
    it("should create a token with the correct properties", () => {
      const verificationToken = new EmailVerificationToken(
        validParams.token,
        validParams.expiresAt,
        validParams.userId
      );

      expect(verificationToken.token).toBe(validParams.token);
      expect(verificationToken.expiresAt).toEqual(validParams.expiresAt);
      expect(verificationToken.userId).toBe(validParams.userId);
    });
  });

  describe("isExpired", () => {
    it("should return true if the token is expired", () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 2);

      const verificationToken = new EmailVerificationToken(
        validParams.token,
        pastDate,
        validParams.userId
      );

      expect(verificationToken.isExpired()).toBe(true);
    });

    it("should return false if the token is not expired", () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const verificationToken = new EmailVerificationToken(
        validParams.token,
        futureDate,
        validParams.userId
      );

      expect(verificationToken.isExpired()).toBe(false);
    });
  });

  describe("validate", () => {
    it("should not throw an error for valid token", () => {
      const verificationToken = new EmailVerificationToken(
        validParams.token,
        validParams.expiresAt,
        validParams.userId
      );

      expect(() => verificationToken.validate()).not.toThrow();
    });

    it("should throw AppError for invalid token", () => {
      const invalidToken = "";

      const verificationToken = new EmailVerificationToken(
        invalidToken,
        validParams.expiresAt,
        validParams.userId
      );

      const validateSyncSpy = jest
        .spyOn(classValidator, "validateSync")
        .mockReturnValue([
          {
            property: "token",
            constraints: {
              isNotEmpty: "Token cannot be empty",
            },
            children: [],
            target: verificationToken,
            value: "",
          },
        ]);

      const validateFunc = () => verificationToken.validate();
      expect(validateFunc).toThrow(AppError);
      expect(validateFunc).toThrow("Token cannot be empty");

      validateSyncSpy.mockRestore();
    });
  });
});
