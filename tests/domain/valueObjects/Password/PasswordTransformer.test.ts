import { PasswordTransformer } from "@/domain/valueObjects/Password/PasswordTransformer";
import { Password } from "@/domain/valueObjects/Password";

describe("PasswordTransformer", () => {
  it("should transform a Password object to its string value", () => {
    // Arrange
    const plainPassword = "password123";
    const password = new Password(plainPassword);
    const transformer = new PasswordTransformer();

    // Act
    const transformedValue = transformer.to(password);

    // Assert
    expect(transformedValue).toBe(password.getValue());
  });

  it("should transform a string to a hashed Password object", () => {
    // Arrange
    const hashedPassword =
      "$2b$10$gqwxWb.WDf6xnadzEU.CL.qGK/I5iynXbyjNIlduOuJFlSyTdWWNi";
    const transformer = new PasswordTransformer();

    // Act
    const password = transformer.from(hashedPassword);

    // Assert
    expect(password.getValue()).toBe(hashedPassword);
    expect(password.getIsHashed()).toBe(true);
  });
});
