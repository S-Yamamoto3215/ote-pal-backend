import { User } from "@/domain/entities/User";
import { CreateUserInput, CreateUserWithFamilyInput, RegisterUserInput } from "@/types/UserTypes";

export interface IUserUseCase {
  createUser(input: CreateUserInput): Promise<User>;
  createUserWithFamily(input: CreateUserWithFamilyInput): Promise<User>;
  registerUser(input: RegisterUserInput): Promise<User>;
  verifyEmail(token: string): Promise<User>;
  resendVerificationEmail(email: string): Promise<void>;
}
