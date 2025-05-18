import { User } from "@/domain/entities/User";
import { Password } from "@/domain/valueObjects/Password";

export const createMockUser = (override: {
  id?: number;
  name?: string;
  email?: string;
  password?: Password;
  role?: "Parent" | "Child";
  isVerified?: boolean;
  familyId?: number | null;
} = {}): User => {
  const mockPassword = new Password("password123");

  const defaultProps = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    password: mockPassword,
    role: "Parent",
    isVerified: false,
    familyId: null,
  };

  const mergedProps = { ...defaultProps, ...override };

  const user = new User(
    mergedProps.name,
    mergedProps.email,
    mergedProps.password,
    mergedProps.role as "Parent" | "Child",
    mergedProps.isVerified,
    mergedProps.familyId
  );

  if (mergedProps.id !== undefined) {
    Object.defineProperty(user, 'id', {
      value: mergedProps.id,
      writable: true,
      enumerable: true,
    });
  }

  return user;
};
