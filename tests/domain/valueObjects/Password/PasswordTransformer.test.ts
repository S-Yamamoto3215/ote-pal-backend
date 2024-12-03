import { Password, PasswordTransformer } from "@/domain/valueObjects/Password";

describe("PasswordTransformer", () => {
  it("should transform a Password to a string", () => {
    const password = new Password("password");
    const transformer = new PasswordTransformer();
    expect(transformer.to(password)).toBe("password");
  });

  it("should transform a string to a Password", () => {
    const transformer = new PasswordTransformer();
    expect(transformer.from("password")).toBeInstanceOf(Password);
  });
});
