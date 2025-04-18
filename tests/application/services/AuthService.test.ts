import { config } from "@/config";
import { AuthService } from "@/application/services/AuthService";
import { User } from "@/domain/entities/User";
import { Password } from "@/domain/valueObjects/Password";

describe("AuthService", () => {
  let authService: AuthService;

  beforeAll(() => {
    authService = new AuthService();
  });

  describe("generateToken", () => {
    it("should generate a valid JWT token for a user", () => {
      const user = new User(
        "John Doe",
        "john.doe@example.com",
        new Password("hashed_password"),
        "Parent",
        false,
        1,
      );

      const token = authService.generateToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid JWT token", () => {
      const user = new User(
        "John Doe",
        "john.doe@example.com",
        new Password("hashed_password"),
        "Parent",
        false,
        1,
      );

      const token = authService.generateToken(user);
      const payload = authService.verifyToken(token);

      expect(payload).toBeDefined();
      expect(payload).toHaveProperty("email", user.email);
      expect(payload).toHaveProperty("role", user.role);
    });

    it("should throw an error for an invalid JWT token", () => {
      const invalidToken = "invalid_token";

      expect(() => authService.verifyToken(invalidToken)).toThrow(
        "Invalid or expired token",
      );
    });
  });
});
