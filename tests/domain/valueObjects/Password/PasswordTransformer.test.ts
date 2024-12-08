import { PasswordTransformer } from "@/domain/valueObjects/Password/PasswordTransformer";
import { Password } from "@/domain/valueObjects/Password";

describe("PasswordTransformer", () => {
  it("should transform a Password to a string", () => {
    const plainPassword = "password123";
    const password = new Password(plainPassword);
    const transformer = new PasswordTransformer();

    const transformedValue = transformer.to(password);
    expect(transformedValue).toBe(password.getValue());
  });

  it("should transform a string to a Password", () => {
    const hashedPassword =
      "$2b$10$gqwxWb.WDf6xnadzEU.CL.qGK/I5iynXbyjNIlduOuJFlSyTdWWNi";
    const transformer = new PasswordTransformer();

    const password = transformer.from(hashedPassword);
    expect(password.getValue()).toBe(hashedPassword);
    expect(password.getIsHashed()).toBe(true);
  });
});
