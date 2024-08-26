import { validate } from "class-validator";

import { User } from "../entities/User";
import { UserError, UserErrorType } from "../errors/UserError";
import { UserRepository } from "../repositories/UserRepository";
import { hashPassword } from "./helpers/bcrypt";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(user: User): Promise<User> {
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new UserError("Validation failed", UserErrorType.ValidationError);
    }

    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new UserError("User already exists", UserErrorType.AlreadyExists);
    }

    user.password = await hashPassword(user.password);
    return await this.userRepository.save(user);
  }

  async findUser(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async findMyFamilyUsers(id: string): Promise<User[]> {
    return await this.userRepository.findMyFamilyUsers(id);
  }

  async updateUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async deleteUser(user: User): Promise<User> {
    return await this.userRepository.delete(user);
  }
}
