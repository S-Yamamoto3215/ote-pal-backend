import * as crypto from "crypto";

import { User } from "@/domain/entities/User";
import { Family } from "@/domain/entities/Family";
import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";
import { Password } from "@/domain/valueObjects/Password";
import {
  CreateUserInput,
  CreateUserWithFamilyInput,
  RegisterUserInput,
} from "@/types/UserTypes";

import { IUserRepository } from "@/domain/repositories/UserRepository";
import { IEmailVerificationTokenRepository } from "@/domain/repositories/EmailVerificationTokenRepository";
import { IMailService } from "@/application/services/MailService";

import { IUserUseCase } from "@/application/usecases/UserUseCase";

import { AppError } from "@/infrastructure/errors/AppError";
import { config } from "@/config";

export class UserUseCase implements IUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private tokenRepository: IEmailVerificationTokenRepository,
    private mailService: IMailService
  ) {}

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
        false,
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
        false,
        null
      );

      // リポジトリにトランザクション処理を委譲
      const result = await this.userRepository.saveWithFamily(user, family);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async registerUser(input: RegisterUserInput): Promise<User> {
    try {
      const userExists = await this.userRepository.findByEmail(input.email);
      if (userExists) {
        throw new AppError("ValidationError", "User already exists");
      }

      const user = new User(
        input.name,
        input.email,
        new Password(input.password),
        "Parent",
        false,
        null
      );

      const savedUser = await this.userRepository.save(user);

      await this.generateAndSendVerificationToken(savedUser);

      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<User> {
    try {
      const verificationToken = await this.tokenRepository.findByToken(token);
      if (!verificationToken) {
        throw new AppError("ValidationError", "Invalid verification token");
      }

      if (verificationToken.isExpired()) {
        await this.tokenRepository.deleteByUserId(verificationToken.userId);
        throw new AppError("ValidationError", "Verification token has expired");
      }

      const user = await this.userRepository.updateVerificationStatus(
        verificationToken.userId,
        true
      );

      await this.tokenRepository.deleteByUserId(verificationToken.userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async resendVerificationEmail(email: string): Promise<void> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new AppError("ValidationError", "User not found");
      }

      if (user.isVerified) {
        throw new AppError("ValidationError", "User is already verified");
      }

      await this.tokenRepository.deleteByUserId(user.id!);
      await this.generateAndSendVerificationToken(user);
    } catch (error) {
      throw error;
    }
  }

  private async generateAndSendVerificationToken(user: User): Promise<void> {
    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + config.token.verificationExpiryHours);

    const verificationToken = new EmailVerificationToken(
      token,
      expiresAt,
      user.id!
    );
    await this.tokenRepository.save(verificationToken);

    await this.mailService.sendVerificationEmail(user.email, user.name, token);
  }
}
