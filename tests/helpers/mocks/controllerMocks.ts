import { IUserUseCase } from "@/application/usecases/UserUseCase";
import { ITaskUseCase } from "@/application/usecases/TaskUseCase";
import { IAuthUseCase } from "@/application/usecases/AuthUseCase";
import { IFamilyUseCase } from "@/application/usecases/FamilyUseCase";
import { IWorkUseCase } from "@/application/usecases/WorkUseCase";

/**
 * ユーザーユースケースのモックを作成する
 */
export const createMockUserUseCase = (): jest.Mocked<IUserUseCase> => {
  return {
    createUser: jest.fn(),
    createUserWithFamily: jest.fn(),
    registerUser: jest.fn(),
    verifyEmail: jest.fn(),
    resendVerificationEmail: jest.fn(),
    inviteFamilyMember: jest.fn(),
    acceptInvitation: jest.fn(),
    resendInvitation: jest.fn(),
  } as jest.Mocked<IUserUseCase>;
};

/**
 * タスクユースケースのモックを作成する
 */
export const createMockTaskUseCase = (): jest.Mocked<ITaskUseCase> => {
  return {
    getTaskById: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  } as jest.Mocked<ITaskUseCase>;
};

/**
 * 認証ユースケースのモックを作成する
 */
export const createMockAuthUseCase = (): jest.Mocked<IAuthUseCase> => {
  return {
    login: jest.fn(),
  } as jest.Mocked<IAuthUseCase>;
};

/**
 * ファミリーユースケースのモックを作成する
 */
export const createMockFamilyUseCase = (): jest.Mocked<IFamilyUseCase> => {
  return {
    createFamily: jest.fn(),
    getFamilyById: jest.fn(),
    getFamilyDetailById: jest.fn(),
  } as jest.Mocked<IFamilyUseCase>;
};

/**
 * ワークユースケースのモックを作成する
 */
export const createMockWorkUseCase = (): jest.Mocked<IWorkUseCase> => {
  return {
    createWork: jest.fn(),
    deleteWork: jest.fn(),
  } as jest.Mocked<IWorkUseCase>;
};
