import { Password } from "@/domain/valueObjects/Password";

describe("Password", () => {
  it("should hash a password correctly when initialized with plain text", async () => {
    // Arrange & Act
    const password = new Password("password");

    // Assert
    expect(password.getIsHashed()).toBe(true);
  });

  it("should throw 'Password is required' error when creating a password with an empty value", () => {
    // Arrange & Act & Assert
    expect(() => new Password("")).toThrow("Password is required");
  });

  it("should throw 'Password must be between 6 and 20' error when creating a password with less than 6 characters", () => {
    // Arrange & Act & Assert
    expect(() => new Password("12345")).toThrow(
      "Password must be between 6 and 20",
    );
  });

  it("should throw 'Password must be between 6 and 20' error when creating a password with more than 20 characters", () => {
    // Arrange & Act & Assert
    expect(() => new Password("abcdefghijklmnopqrstuvwxyz")).toThrow(
      "Password must be between 6 and 20",
    );
  });

  it("should return true when comparing a hashed password with the correct plain password", async () => {
    // Arrange
    const password = new Password("password");

    // Act
    const result = await password.compare("password");

    // Assert
    expect(result).toBe(true);
  });

  it("should return false when comparing a hashed password with an incorrect plain password", async () => {
    // Arrange
    const password = new Password("password");

    // Act
    const result = await password.compare("test");

    // Assert
    expect(result).toBe(false);
  });

  it("should mark password as hashed when created using fromHashed factory method", () => {
    // Arrange & Act
    const password = Password.fromHashed("hashedPassword");

    // Assert
    expect(password.getIsHashed()).toBe(true);
  });
});
