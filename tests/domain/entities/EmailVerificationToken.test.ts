import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";

// import { emailVerificationTokenSeeds } from "@tests/resources/EmailVerificationToken/EmailVerificationTokenSeeds";

describe("EmailVerificationToken Entity", () => {
  describe("constructor", () => {
    it("should create a token with the correct properties", () => {
      const token = "test-token-123";
      const userId = 1;
      const expiresAt = new Date();

      const verificationToken = new EmailVerificationToken(token, expiresAt, userId);

      expect(verificationToken.token).toBe(token);
      expect(verificationToken.userId).toBe(userId);
      expect(verificationToken.expiresAt).toBe(expiresAt);
    });
  });

  describe("isExpired", () => {
    it("should return true if the token is expired", () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 2);

      const verificationToken = new EmailVerificationToken("token", pastDate, 1);

      expect(verificationToken.isExpired()).toBe(true);
    });

    it("should return false if the token is not expired", () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const verificationToken = new EmailVerificationToken("token", futureDate, 1);

      expect(verificationToken.isExpired()).toBe(false);
    });
  });

  // MEMO: バリデーションのテストは、未実装なので一旦コメントアウト
  // describe("validate", () => {
  //   it("should not throw an error for valid token", () => {
  //     const verificationToken = new EmailVerificationToken(
  //       "valid-token",
  //       new Date(Date.now() + 3600000), // 1時間後
  //       1
  //     );

  //     expect(() => verificationToken.validate()).not.toThrow();
  //   });
  // });
});
