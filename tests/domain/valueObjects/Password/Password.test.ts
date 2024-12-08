import { Password } from "@/domain/valueObjects/Password";

describe("Password", () => {
  it("should hash a password correctly", async () => {
    const password = new Password("password");
    expect(password.getIsHashed()).toBe(true);
  });

  it("should throw an error when creating a password with an empty value", () => {
    expect(() => new Password("")).toThrow("Password is required");
  });

  it("should throw an error when creating a password with less than 6 characters", () => {
    expect(() => new Password("12345")).toThrow(
      "Password must be between 6 and 20",
    );
  });

  it("should throw an error when creating a password with more than 20 characters", () => {
    expect(() => new Password("abcdefghijklmnopqrstuvwxyz")).toThrow(
      "Password must be between 6 and 20",
    );
  });

  it("should correctly compare a hashed password with a plain one", async () => {
    const password = new Password("password");
    expect(await password.compare("password")).toBe(true);
  });

  it("should return false when comparing a hashed password with an incorrect plain one", async () => {
    const password = new Password("password");
    expect(await password.compare("test")).toBe(false);
  });

  it("should return true when Password is fromHashed", () => {
    const password = Password.fromHashed("hashedPassword");
    expect(password.getIsHashed()).toBe(true);
  });
});
