import bcrypt from "bcrypt";

import { Password } from "@/domain/valueObjects/Password";

import { AppError } from "@/infrastructure/errors/AppError";

describe("Password Value Object", () => {
  it("should create a valid Password object and hash the password", () => {
    const plainPassword = "validPassword123";
    const password = new Password(plainPassword);

    expect(password).toBeInstanceOf(Password);
    expect(password.getValue()).not.toBe(plainPassword);
    expect(bcrypt.compareSync(plainPassword, password.getValue())).toBe(true);
  });

  it("should throw an error if the password is empty", () => {
    expect(() => new Password("")).toThrow(AppError);
  });

  it("should throw an error if the password is too short", () => {
    expect(() => new Password("short")).toThrow(AppError);
  });

  it("should throw an error if the password is too long", () => {
    expect(() => new Password("thispasswordiswaytoolongtobevalid")).toThrow(AppError);
  });

  it("should create a Password object with a pre-hashed password", () => {
    const hashedPassword = bcrypt.hashSync("validPassword123", 10);
    const password = new Password(hashedPassword, true);

    expect(password).toBeInstanceOf(Password);
    expect(password.getValue()).toBe(hashedPassword);
  });

  it("should compare a plain password with the hashed password correctly", async () => {
    const plainPassword = "validPassword123";
    const password = new Password(plainPassword);

    const isMatch = await password.comparePassword(plainPassword);
    expect(isMatch).toBe(true);

    const isNotMatch = await password.comparePassword("invalidPassword");
    expect(isNotMatch).toBe(false);
  });
});
