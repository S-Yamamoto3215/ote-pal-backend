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
    it("should return valid JWT string when user object is provided", () => {
      // Arrange
      const user = new User(
        "John Doe",
        "john.doe@example.com",
        new Password("hashed_password"),
        "Parent",
        false,
        1,
      );

      // Act
      const token = authService.generateToken(user);

      // Assert
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });
  });

  describe("verifyToken", () => {
    it("should return token payload with user data when valid token is provided", () => {
      // Arrange
      const user = new User(
        "John Doe",
        "john.doe@example.com",
        new Password("hashed_password"),
        "Parent",
        false,
        1,
      );
      const token = authService.generateToken(user);
      
      // Act
      const payload = authService.verifyToken(token);

      // Assert
      expect(payload).toBeDefined();
      expect(payload).toHaveProperty("email", user.email);
      expect(payload).toHaveProperty("role", user.role);
    });

    it("should throw 'Invalid token' error when invalid token is provided", () => {
      // Arrange
      const invalidToken = "invalid_token";

      // Act & Assert
      expect(() => authService.verifyToken(invalidToken)).toThrow(
        "Invalid token"
      );
    });
  });
});
