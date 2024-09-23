import { User } from "@/domain/entities/User";
import { AppError } from "@/infrastructure/errors/AppError";

describe("User Entity", () => {
  it("should create a valid User", () => {
    const user = new User("John Doe", "john.doe@example.com", "password123", "Parent", 1);
    expect(user.getName()).toBe("John Doe");
    expect(user.getEmail()).toBe("john.doe@example.com");
    expect(user.getPassword()).toBe("password123");
    expect(user.getRole()).toBe("Parent");
    expect(user.getFamilyId()).toBe(1);
  });

  it("should throw validation error for invalid email", () => {
    const user = new User("John Doe", "invalid-email", "password123", "Parent", 1);
    expect(() => user.validate()).toThrow(AppError);
  });

  it("should throw validation error for empty name", () => {
    const user = new User("", "john.doe@example.com", "password123", "Parent", 1);
    expect(() => user.validate()).toThrow(AppError);
  });

  it("should throw validation error for short password", () => {
    const user = new User("John Doe", "john.doe@example.com", "123", "Parent", 1);
    expect(() => user.validate()).toThrow(AppError);
  });

  it("should throw validation error for invalid role", () => {
    const user = new User("John Doe", "john.doe@example.com", "password123", "InvalidRole" as "Parent", 1);
    expect(() => user.validate()).toThrow(AppError);
  });

  it("should set and get properties correctly", () => {
    const user = new User("John Doe", "john.doe@example.com", "password123", "Parent", 1);
    user.setName("Jane Doe");
    user.setEmail("jane.doe@example.com");
    user.setPassword("newpassword123");
    user.setRole("Child");
    user.setFamilyId(2);

    expect(user.getName()).toBe("Jane Doe");
    expect(user.getEmail()).toBe("jane.doe@example.com");
    expect(user.getPassword()).toBe("newpassword123");
    expect(user.getRole()).toBe("Child");
    expect(user.getFamilyId()).toBe(2);
  });
});
