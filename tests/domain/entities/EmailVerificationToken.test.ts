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
    it("should create a EmailVerificationToken when valid parameters are provided", () => {
      const { token, expiresAt, userId } = validParams;

      const verificationToken = new EmailVerificationToken(token, expiresAt, userId);

      expect(verificationToken.token).toBe(token);
      expect(verificationToken.expiresAt).toEqual(expiresAt);
      expect(verificationToken.userId).toBe(userId);
    });
  });

  describe("validate", () => {
    it("should not throw an error when valid token", () => {
      const { token, expiresAt, userId } = validParams;
      const verificationToken = new EmailVerificationToken(token, expiresAt, userId);

      expect(() => verificationToken.validate()).not.toThrow();
    });

    it("should throw AppError when invalid token", () => {
      const { expiresAt, userId } = validParams;
      const invalidToken = "";
      const verificationToken = new EmailVerificationToken(invalidToken, expiresAt, userId);

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

      expect(() => verificationToken.validate()).toThrow(AppError);
      expect(() => verificationToken.validate()).toThrow(
        "Token cannot be empty"
      );

      validateSyncSpy.mockRestore();
    });
  });

  describe("isExpired", () => {
    it("should return true when the token is expired", () => {
      const { token, userId } = validParams;
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 2);

      const verificationToken = new EmailVerificationToken(token, pastDate, userId);

      expect(verificationToken.isExpired()).toBe(true);
    });

    it("should return false when the token is not expired", () => {
      const { token, userId } = validParams;
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const verificationToken = new EmailVerificationToken(token, futureDate, userId);

      expect(verificationToken.isExpired()).toBe(false);
    });
  });
});
