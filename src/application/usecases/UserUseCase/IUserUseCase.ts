import { User } from "@/domain/entities/User";
import { CreateUserInput } from "@/types/UserTypes";

export interface IUserUseCase {
  createUser(input: CreateUserInput): Promise<User>;
}
