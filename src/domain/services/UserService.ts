import { User } from "../entities/User";
import { UserError, UserErrorType } from "../errors/UserError";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(user: User): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new UserError("User already exists", UserErrorType.AlreadyExists);
    }

    user.password = await bcrypt.hash(user.password, 10);
    return await this.userRepository.save(user);
  }

  async findUser(id: string): Promise<User | null > {
    return await this.userRepository.findById(id);
  }

  async findUsersByFamilyID(familyID: string): Promise<User[]> {
    return await this.userRepository.findByFamilyID(familyID);
  }

  async updateUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async deleteUser(user: User): Promise<User> {
    return await this.userRepository.delete(user);
  }
}
