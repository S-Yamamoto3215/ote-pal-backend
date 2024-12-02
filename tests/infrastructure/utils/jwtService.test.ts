import { jwtService } from "@/infrastructure/utils/jwtService";

describe("jwtService", () => {
  const payload = { userId: "1" };

  it("should generate a valid JWT token", () => {
    const token = jwtService.generateToken(payload, "1h");
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  it("should verify a valid JWT token", () => {
    const token = jwtService.generateToken(payload, "1h");
    const decoded = jwtService.verifyToken(token);
    expect(decoded).toBeDefined();
    expect(decoded.userId).toBe(payload.userId);
  });

  it("should throw an error for an invalid token", () => {
    const invalidToken = "invalid.token.here";
    expect(() => jwtService.verifyToken(invalidToken)).toThrow(
      "Invalid or expired token",
    );
  });

  it("should throw an error for an expired token", () => {
    const expiredToken = jwtService.generateToken(payload, "1ms");
    setTimeout(() => {
      expect(() => jwtService.verifyToken(expiredToken)).toThrow(
        "Invalid or expired token",
      );
    }, 10);
  });
});
