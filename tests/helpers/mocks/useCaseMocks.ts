import { IUserRepository } from "@/domain/repositories/UserRepository";
import { ITaskRepository } from "@/domain/repositories/TaskRepository";
import { IEmailVerificationTokenRepository } from "@/domain/repositories/EmailVerificationTokenRepository";
import { IFamilyInvitationTokenRepository } from "@/domain/repositories/FamilyInvitationTokenRepository";
import { IFamilyRepository } from "@/domain/repositories/FamilyRepository";
import { IWorkRepository } from "@/domain/repositories/WorkRepository";
import { IMailService } from "@/application/services/MailService";
import { IAuthService } from "@/application/services/AuthService";

/**
 * ユーザーリポジトリのモックを作成する
 */
export const createMockUserRepository = (): jest.Mocked<IUserRepository> => {
  return {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    saveWithFamily: jest.fn(),
    updateVerificationStatus: jest.fn(),
  } as jest.Mocked<IUserRepository>;
};

/**
 * タスクリポジトリのモックを作成する
 */
export const createMockTaskRepository = (): jest.Mocked<ITaskRepository> => {
  return {
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  } as jest.Mocked<ITaskRepository>;
};

/**
 * メール検証トークンリポジトリのモックを作成する
 */
export const createMockEmailVerificationTokenRepository = (): jest.Mocked<IEmailVerificationTokenRepository> => {
  return {
    save: jest.fn(),
    findByToken: jest.fn(),
    deleteByUserId: jest.fn(),
  } as jest.Mocked<IEmailVerificationTokenRepository>;
};

/**
 * 家族招待トークンリポジトリのモックを作成する
 */
export const createMockFamilyInvitationTokenRepository = (): jest.Mocked<IFamilyInvitationTokenRepository> => {
  return {
    save: jest.fn(),
    findByToken: jest.fn(),
    findByEmail: jest.fn(),
    deleteByToken: jest.fn(),
    deleteByEmail: jest.fn(),
  } as jest.Mocked<IFamilyInvitationTokenRepository>;
};

/**
 * ファミリーリポジトリのモックを作成する
 */
export const createMockFamilyRepository = (): jest.Mocked<IFamilyRepository> => {
  return {
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<IFamilyRepository>;
};

/**
 * ワークリポジトリのモックを作成する
 */
export const createMockWorkRepository = (): jest.Mocked<IWorkRepository> => {
  return {
    save: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<IWorkRepository>;
};

/**
 * メールサービスのモックを作成する
 */
export const createMockMailService = (): jest.Mocked<IMailService> => {
  return {
    sendVerificationEmail: jest.fn(),
    sendFamilyInvitationEmail: jest.fn(),
  } as jest.Mocked<IMailService>;
};

/**
 * 認証サービスのモックを作成する
 */
export const createMockAuthService = (): jest.Mocked<IAuthService> => {
  return {
    generateToken: jest.fn(),
    verifyToken: jest.fn(),
  } as jest.Mocked<IAuthService>;
};
