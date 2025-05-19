import { User } from "@/domain/entities/User";
import { Password } from "@/domain/valueObjects/Password";
import { AppError } from "@/infrastructure/errors/AppError";

describe("User Entity", () => {
  const validParams = {
    name: "Test Parent User1",
    email: "user1@example.com",
    password: new Password("validPassword123"),
    role: "Parent" as "Parent" | "Child",
    isVerified: true,
    familyId: 1,
  };

  it("should create a valid User", () => {
    const user = new User(
      validParams.name,
      validParams.email,
      validParams.password,
      validParams.role,
      validParams.isVerified,
      validParams.familyId
    );

    expect(user.name).toBe(validParams.name);
    expect(user.email).toBe(validParams.email);
    expect(user.password).toBe(validParams.password);
    expect(user.role).toBe(validParams.role);
    expect(user.familyId).toBe(validParams.familyId);
  });

  it("should throw validation error for invalid email", () => {
    const invalidEmail = "invalid-email";

    const user = new User(
      validParams.name,
      invalidEmail,
      validParams.password,
      validParams.role,
      validParams.isVerified,
      validParams.familyId
    );

    expect(() => user.validate()).toThrow(AppError);
  });

  it("should throw validation error for empty name", () => {
    const emptyName = "";

    const user = new User(
      emptyName,
      validParams.email,
      validParams.password,
      validParams.role,
      validParams.isVerified,
      validParams.familyId
    );

    expect(() => user.validate()).toThrow(AppError);
  });

  it("should throw validation error for invalid role", () => {
    const invalidRole = "InvalidRole" as "Parent" | "Child";

    const user = new User(
      validParams.name,
      validParams.email,
      validParams.password,
      invalidRole,
      validParams.isVerified,
      validParams.familyId
    );

    expect(() => user.validate()).toThrow(AppError);
  });
});
