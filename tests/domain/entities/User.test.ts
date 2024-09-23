import { User } from "@/domain/entities/User";
import { AppError } from "@/infrastructure/errors/AppError";

describe("User Entity", () => {
  it("should create a valid User instance", () => {
    const user = new User(1, "John Doe", "john.doe@example.com", "password123", "Parent");
    expect(user.getFamilyId()).toBe(1);
    expect(user.getName()).toBe("John Doe");
    expect(user.getEmail()).toBe("john.doe@example.com");
    expect(user.getPassword()).toBe("password123");
    expect(user.getRole()).toBe("Parent");
  });

  it("should throw validation error for invalid email", () => {
    expect(() => {
      new User(1, "John Doe", "invalid-email", "password123", "Parent");
    }).toThrow(AppError);
  });

  it("should throw validation error for empty name", () => {
    expect(() => {
      new User(1, "", "john.doe@example.com", "password123", "Parent");
    }).toThrow(AppError);
  });

  it("should throw validation error for short password", () => {
    expect(() => {
      new User(1, "John Doe", "john.doe@example.com", "123", "Parent");
    }).toThrow(AppError);
  });

  it("should throw validation error for invalid role", () => {
    expect(() => {
      new User(1, "John Doe", "john.doe@example.com", "password123", "InvalidRole" as any);
    }).toThrow(AppError);
  });

  it("should update name and validate", () => {
    const user = new User(1, "John Doe", "john.doe@example.com", "password123", "Parent");
    user.setName("Jane Doe");
    expect(user.getName()).toBe("Jane Doe");
  });

  it("should throw validation error when setting invalid email", () => {
    const user = new User(1, "John Doe", "john.doe@example.com", "password123", "Parent");
    expect(() => {
      user.setEmail("invalid-email");
    }).toThrow(AppError);
  });

  it("should update password and validate", () => {
    const user = new User(1, "John Doe", "john.doe@example.com", "password123", "Parent");
    user.setPassword("newpassword123");
    expect(user.getPassword()).toBe("newpassword123");
  });

  it("should throw validation error when setting invalid role", () => {
    const user = new User(1, "John Doe", "john.doe@example.com", "password123", "Parent");
    expect(() => {
      user.setRole("InvalidRole" as any);
    }).toThrow(AppError);
  });
});
