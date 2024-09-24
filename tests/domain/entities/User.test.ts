import { User } from "@/domain/entities/User";
import { AppError } from "@/infrastructure/errors/AppError";

import { userSeeds } from "@tests/resources/User/UserSeeds";

describe("User Entity", () => {
  it("should create a valid User", () => {
    const { name, email, password, role, familyId } = userSeeds[0];
    const user = new User(name, email, password, role as "Parent", familyId);
    expect(user.getName()).toBe(name);
    expect(user.getEmail()).toBe(email);
    expect(user.getPassword()).toBe(password);
    expect(user.getRole()).toBe(role);
    expect(user.getFamilyId()).toBe(familyId);
  });

  it("should throw validation error for invalid email", () => {
    const { name, password, role, familyId } = userSeeds[0];
    const user = new User(name, "invalid-email", password, role as "Parent", familyId);
    expect(() => user.validate()).toThrow(AppError);
  });

  it("should throw validation error for empty name", () => {
    const { email, password, role, familyId } = userSeeds[0];
    const user = new User("", email, password, role as "Parent", familyId);
    expect(() => user.validate()).toThrow(AppError);
  });

  it("should throw validation error for short password", () => {
    const { name, email, role, familyId } = userSeeds[0];
    const user = new User(name, email, "123", role as "Parent", familyId);
    expect(() => user.validate()).toThrow(AppError);
  });

  it("should throw validation error for invalid role", () => {
    const { name, email, password, familyId } = userSeeds[0];
    const user = new User( name, email, password, "InvalidRole" as "Parent", familyId);
    expect(() => user.validate()).toThrow(AppError);
  });

  it("should set and get properties correctly", () => {
    const { name, email, password, role, familyId } = userSeeds[0];
    const user = new User(name, email, password, role as "Parent", familyId);
    user.setId(2);
    user.setName("Jane Doe");
    user.setEmail("jane.doe@example.com");
    user.setPassword("newpassword123");
    user.setRole("Child");
    user.setFamilyId(2);

    expect(user.getId()).toBe(2);
    expect(user.getName()).toBe("Jane Doe");
    expect(user.getEmail()).toBe("jane.doe@example.com");
    expect(user.getPassword()).toBe("newpassword123");
    expect(user.getRole()).toBe("Child");
    expect(user.getFamilyId()).toBe(2);
  });

  it("should throw an error if the user id is undefined", () => {
    const { name, email, password, role, familyId } = userSeeds[0];
    const user = new User(name, email, password, role as "Parent", familyId);
    expect(() => user.getId()).toThrow(AppError);
    expect(() => user.getId()).toThrow("User id is undefined or null");
  });

  it("should throw an error if trying to set the user id when it is already set", () => {
    const { id, name, email, password, role, familyId } = userSeeds[0];
    const user = new User(name, email, password, role as "Parent", familyId);
    user.setId(id);
    expect(() => user.setId(2)).toThrow(AppError);
    expect(() => user.setId(2)).toThrow("User id is already set");
  });
});
