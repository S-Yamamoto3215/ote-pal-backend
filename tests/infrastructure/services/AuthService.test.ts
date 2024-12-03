import { AuthService } from "@/infrastructure/services/AuthService";
import { User } from "@/domain/entities/User";
import { Password } from "@/domain/valueObjects/Password";

describe("AuthService", () => {
  let authService: AuthService;
  const jwtSecret = "test_secret_key";
  const jwtExpiresIn = "1h";

  beforeAll(() => {
    process.env.JWT_SECRET = jwtSecret;
    process.env.JWT_EXPIRES_IN = jwtExpiresIn;

    authService = new AuthService();
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRES_IN;
  });

  describe("generateToken", () => {
    it("should generate a valid JWT token for a user", () => {
      const user = new User(
        "John Doe",
        "john.doe@example.com",
        new Password("hashed_password"),
        "Parent",
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

    it("should throw an error for an expired JWT token", () => {
      process.env.JWT_EXPIRES_IN = "-1h";
      const expiredAuthService = new AuthService();
      const user = new User(
        "John Doe",
        "john.doe@example.com",
        new Password("hashed_password"),
        "Parent",
        1,
      );

      const expiredToken = expiredAuthService.generateToken(user);

      expect(() => expiredAuthService.verifyToken(expiredToken)).toThrow(
        "Invalid or expired token",
      );
    });
  });
});
