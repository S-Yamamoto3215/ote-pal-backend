import { User } from "@/domain/entities/User";
import { Family } from "@/domain/entities/Family";
import { Password } from "@/domain/valueObjects/Password";
import { CreateUserInput, CreateUserWithFamilyInput } from "@/types/UserTypes";

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
        input.familyId
      );

      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async createUserWithFamily(input: CreateUserWithFamilyInput): Promise<User> {
    try {
      const userExists = await this.userRepository.findByEmail(input.email);
      if (userExists) {
        throw new AppError("ValidationError", "User already exists");
      }

      // MEMO: 支払日の初期値は一旦1日とする
      const family = new Family(input.familyName, 1);
      const user = new User(
        input.name,
        input.email,
        new Password(input.password),
        "Parent",
        null
      );

      // リポジトリにトランザクション処理を委譲
      const result = await this.userRepository.saveWithFamily(user, family);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
