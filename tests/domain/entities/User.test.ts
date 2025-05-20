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

  describe("constructor", () => {
    it("should create a User when valid parameters are provided", () => {
      const { name, email, password, role, isVerified, familyId } = validParams;

      const user = new User(name, email, password, role, isVerified, familyId);

      expect(user.name).toBe(name);
      expect(user.email).toBe(email);
      expect(user.password).toBe(password);
      expect(user.role).toBe(role);
      expect(user.familyId).toBe(familyId);
    });
  });

  describe("validate", () => {
    it("should throw validation error when invalid email", () => {
      const { name, password, role, isVerified, familyId } = validParams;
      const invalidEmail = "invalid-email";

      const user = new User(name, invalidEmail, password, role, isVerified, familyId);

      expect(() => user.validate()).toThrow(AppError);
    });

    it("should throw validation error when empty name", () => {
      const { email, password, role, isVerified, familyId } = validParams;
      const emptyName = "";

      const user = new User(emptyName, email, password, role, isVerified, familyId);

      expect(() => user.validate()).toThrow(AppError);
    });

    it("should throw validation error when invalid role", () => {
      const { name, email, password, isVerified, familyId } = validParams;
      const invalidRole = "InvalidRole" as "Parent" | "Child";

      const user = new User(name, email, password, invalidRole, isVerified, familyId);

      expect(() => user.validate()).toThrow(AppError);
    });
  });
});
