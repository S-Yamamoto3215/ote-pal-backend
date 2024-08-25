import { User } from "../entities/User";
import { UserError, UserErrorType } from "../errors/UserError";
import { UserRepository } from "../repositories/UserRepository";
import { hashPassword, comparePassword } from "./helpers/bcrypt";
import { generateToken } from "./helpers/jwt";
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

    user.password = await hashPassword(user.password);
    return await this.userRepository.save(user);
  }

  async loginUser(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserError("User not found", UserErrorType.NonUser);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UserError("Invalid password", UserErrorType.PasswordValid);
    }

    const token = generateToken(user);

    return token;
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
