import * as crypto from "crypto";

import { User } from "@/domain/entities/User";
import { Family } from "@/domain/entities/Family";
import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";
import { FamilyInvitationToken } from "@/domain/entities/FamilyInvitationToken";
import { Password } from "@/domain/valueObjects/Password";
import {
  CreateUserInput,
  RegisterUserInput,
  InviteFamilyMemberInput,
  AcceptInvitationInput,
} from "@/types/UserTypes";

import { IUserRepository } from "@/domain/repositories/UserRepository";
import { IFamilyRepository } from "@/domain/repositories/FamilyRepository";
import { IEmailVerificationTokenRepository } from "@/domain/repositories/EmailVerificationTokenRepository";
import { IFamilyInvitationTokenRepository } from "@/domain/repositories/FamilyInvitationTokenRepository";
import { IMailService } from "@/application/services/MailService";

import { IUserUseCase } from "@/application/usecases/UserUseCase";

import { AppError } from "@/infrastructure/errors/AppError";
import { config } from "@/config";

export class UserUseCase implements IUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private tokenRepository: IEmailVerificationTokenRepository,
    private invitationRepository: IFamilyInvitationTokenRepository,
    private familyRepository: IFamilyRepository,
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
    expiresAt.setHours(
      expiresAt.getHours() + config.token.verificationExpiryHours
    );

    const verificationToken = new EmailVerificationToken(
      token,
      expiresAt,
      user.id!
    );
    await this.tokenRepository.save(verificationToken);

    await this.mailService.sendVerificationEmail(user.email, user.name, token);
  }

  async inviteFamilyMember(input: InviteFamilyMemberInput): Promise<void> {
    try {
      // すでに登録済みのユーザーが存在するか確認
      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser) {
        throw new AppError(
          "ValidationError",
          "このメールアドレスは既に登録されています"
        );
      }

      // 招待者のユーザーを取得
      const inviter = await this.userRepository.findById(input.inviterId);

      // 招待者が存在しており、親ロールであるか確認
      if (!inviter || inviter.role !== "Parent") {
        throw new AppError("Unauthorized", "招待権限がありません");
      }

      // 招待者の家族IDを使用
      if (!inviter.familyId) {
        throw new AppError("ValidationError", "招待者が家族に所属していません");
      }

      // 同じメールアドレスへの既存の招待を削除
      await this.invitationRepository.deleteByEmail(
        input.email,
        inviter.familyId
      );

      // 招待先の家族名を取得するために家族エンティティを取得
      const family = await this.familyRepository.findById(inviter.familyId);
      if (!family) {
        throw new AppError("NotFound", "指定された家族が見つかりません");
      }

      // 招待トークンを生成
      const token = crypto.randomBytes(32).toString("hex");

      // 有効期限を設定（24時間）
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // 招待トークンをデータベースに保存
      const invitationToken = new FamilyInvitationToken(
        token,
        expiresAt,
        input.email,
        input.role,
        inviter.familyId, // 招待者の家族IDを使用
        inviter.id!
      );
      await this.invitationRepository.save(invitationToken);

      // 招待メールを送信
      await this.mailService.sendFamilyInvitationEmail(
        input.email,
        inviter.name,
        family.name,
        input.role,
        token
      );
    } catch (error) {
      throw error;
    }
  }

  async acceptInvitation(input: AcceptInvitationInput): Promise<User> {
    try {
      // トークンが有効か確認
      const invitationToken = await this.invitationRepository.findByToken(
        input.token
      );
      if (!invitationToken) {
        throw new AppError("ValidationError", "無効な招待トークンです");
      }

      // トークンの有効期限を確認
      if (invitationToken.isExpired()) {
        await this.invitationRepository.deleteByToken(input.token);
        throw new AppError("ValidationError", "招待の有効期限が切れています");
      }

      // 家族が存在するか確認
      const family = await this.familyRepository.findById(
        invitationToken.familyId
      );
      if (!family) {
        throw new AppError("NotFound", "指定された家族が見つかりません");
      }

      // メールアドレスが既に登録されているか確認
      const existingUser = await this.userRepository.findByEmail(
        invitationToken.email
      );

      let user: User;

      if (existingUser) {
        // すでに登録済みのユーザーの場合
        if (existingUser.familyId) {
          throw new AppError(
            "ValidationError",
            "このユーザーはすでに家族に所属しています"
          );
        }

        // 家族IDを更新
        existingUser.familyId = invitationToken.familyId;
        user = await this.userRepository.save(existingUser);
      } else {
        // 新規ユーザーの場合は作成
        user = new User(
          input.name,
          invitationToken.email,
          new Password(input.password),
          invitationToken.role,
          true, // 招待から登録の場合は検証済みとする
          invitationToken.familyId
        );

        user = await this.userRepository.save(user);
      }

      // 使用済みの招待トークンを削除
      await this.invitationRepository.deleteByToken(input.token);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async resendInvitation(email: string, familyId: number): Promise<void> {
    try {
      // 招待トークンを確認
      const invitationToken = await this.invitationRepository.findByEmail(
        email,
        familyId
      );
      if (!invitationToken) {
        throw new AppError("ValidationError", "招待が見つかりません");
      }

      // 招待者が存在するか確認
      const inviter = await this.userRepository.findById(
        invitationToken.inviterId
      );
      if (!inviter) {
        throw new AppError("NotFound", "招待者が見つかりません");
      }

      // 家族が存在するか確認
      const family = await this.familyRepository.findById(familyId);
      if (!family) {
        throw new AppError("NotFound", "指定された家族が見つかりません");
      }

      // 古い招待トークンを削除
      await this.invitationRepository.deleteByEmail(email, familyId);

      // 新しい招待トークンを生成
      const token = crypto.randomBytes(32).toString("hex");

      // 有効期限を設定（24時間）
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // 新しい招待トークンをデータベースに保存
      const newInvitationToken = new FamilyInvitationToken(
        token,
        expiresAt,
        email,
        invitationToken.role,
        familyId,
        invitationToken.inviterId
      );
      await this.invitationRepository.save(newInvitationToken);

      // 招待メールを再送信
      await this.mailService.sendFamilyInvitationEmail(
        email,
        inviter.name,
        family.name,
        invitationToken.role,
        token
      );
    } catch (error) {
      throw error;
    }
  }
}
