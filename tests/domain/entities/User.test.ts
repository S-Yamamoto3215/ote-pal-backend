import { User } from "@/domain/entities/User";
import { AppError } from "@/infrastructure/errors/AppError";

import { userSeeds } from "@tests/resources/User/UserSeeds";

describe("User Entity", () => {
  it("should create a valid User", () => {
    const { name, email, password, role, familyId } = userSeeds[0];
    const user = new User(name, email, password, role as "Parent", familyId);
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.password).not.toBe(password);
    expect(user.role).toBe(role);
    expect(user.familyId).toBe(familyId);
  });

  it("should throw validation error for invalid email", () => {
    const { name, password, role, familyId } = userSeeds[0];
    const user = new User(
      name,
      "invalid-email",
      password,
      role as "Parent",
      familyId,
    );
    expect(() => user.validate()).toThrow(AppError);
  });

  it("should throw validation error for empty name", () => {
    const { email, password, role, familyId } = userSeeds[0];
    const user = new User("", email, password, role as "Parent", familyId);
    expect(() => user.validate()).toThrow(AppError);
  });

  it("should throw validation error for invalid role", () => {
    const { name, email, password, familyId } = userSeeds[0];
    const user = new User(
      name,
      email,
      password,
      "InvalidRole" as "Parent",
      familyId,
    );
    expect(() => user.validate()).toThrow(AppError);
  });
});
