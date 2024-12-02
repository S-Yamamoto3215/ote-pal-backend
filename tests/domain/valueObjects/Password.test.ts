import { Password } from "@/domain/valueObjects/Password";

describe("Password", () => {
  it("should hash a password correctly", async () => {
    const password = new Password("password");
    await password.hash();
    expect(password.getIsHashed()).toBe(true);
  });

  it("should throw an error when comparing non-hashed passwords", async () => {
    const password = new Password("password");
    await expect(password.compare("password")).rejects.toThrow(
      "Cannot compare a non-hashed password",
    );
  });

  it("should correctly compare a hashed password with a plain one", async () => {
    const password = new Password("password");
    await password.hash();
    expect(await password.compare("password")).toBe(true);
  });

  it("should return false when comparing a hashed password with an incorrect plain one", async () => {
    const password = new Password("password");
    await password.hash();
    expect(await password.compare("test")).toBe(false);
  });

  it("should return true when Password is fromHashed", () => {
    const password = Password.fromHashed("hashedPassword");
    expect(password.getIsHashed()).toBe(true);
  });
});
