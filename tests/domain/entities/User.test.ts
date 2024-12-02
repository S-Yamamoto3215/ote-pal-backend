import { User } from "@/domain/entities/User";
import { Password } from "@/domain/valueObjects/Password";
import { AppError } from "@/infrastructure/errors/AppError";

import { userSeeds } from "@tests/resources/User/UserSeeds";

describe("User Entity", () => {
  it("should create a valid User", () => {
    const { name, email, password, role, familyId } = userSeeds[0];
    const passwordObj = new Password(password);
    const user = new User(name, email, passwordObj, role as "Parent", familyId);
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    // FIXME: passwordに関するテストを追加
    expect(user.role).toBe(role);
    expect(user.familyId).toBe(familyId);
  });

  it("should throw validation error for invalid email", () => {
    const { name, password, role, familyId } = userSeeds[0];
    const passwordObj = new Password(password);
    const user = new User(
      name,
      "invalid-email",
      passwordObj,
      role as "Parent",
      familyId,
    );
    expect(() => user.validate()).toThrow(AppError);
  });

  it("should throw validation error for empty name", () => {
    const { email, password, role, familyId } = userSeeds[0];
    const passwordObj = new Password(password);
    const user = new User("", email, passwordObj, role as "Parent", familyId);
    expect(() => user.validate()).toThrow(AppError);
  });

  it("should throw validation error for invalid role", () => {
    const { name, email, password, familyId } = userSeeds[0];
    const passwordObj = new Password(password);
    const user = new User(
      name,
      email,
      passwordObj,
      "InvalidRole" as "Parent",
      familyId,
    );
    expect(() => user.validate()).toThrow(AppError);
  });
});
