import { User } from "@/domain/entities/User";
import { Password } from "@/domain/valueObjects/Password";
import { CreateUserInput } from "@/types/UserTypes";

import { IUserRepository } from "@/domain/repositories/UserRepository";

import { IUserUseCase } from "@/application/usecases/UserUseCase";

import { AppError } from "@/infrastructure/errors/AppError";

export class UserUseCase implements IUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async createUser(input: CreateUserInput): Promise<User> {
    try {
      const userExists = await this.userRepository.findByEmail(input.email);
      if (userExists) {
        throw new AppError("ValidationError", "User already exists");
      }

      const user = new User(
        input.name,
        input.email,
        new Password(input.password),
        input.role,
        input.familyId,
      );

      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }
}
