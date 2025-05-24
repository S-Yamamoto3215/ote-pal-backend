import { UserUseCase } from "@/application/usecases/UserUseCase/UserUseCase";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { IEmailVerificationTokenRepository } from "@/domain/repositories/EmailVerificationTokenRepository";
import { IFamilyInvitationTokenRepository } from "@/domain/repositories/FamilyInvitationTokenRepository";
import { IFamilyRepository } from "@/domain/repositories/FamilyRepository";
import { IMailService } from "@/application/services/MailService";
import { AppError } from "@/infrastructure/errors/AppError";
import { User } from "@/domain/entities/User";
import { InviteFamilyMemberInput } from "@/types/UserTypes";
import { FamilyInvitationToken } from "@/domain/entities/FamilyInvitationToken";

import { createMockUser, createMockFamily, createMockFamilyInvitationToken } from "@tests/helpers/factories";
import { createUserUseCaseMocks } from "@tests/helpers/mocks/userUseCaseMocks";

describe("UserInvitation", () => {
  let userUseCase: UserUseCase;
  let mocks: {
    userRepository: jest.Mocked<IUserRepository>;
    emailVerificationTokenRepository: jest.Mocked<IEmailVerificationTokenRepository>;
    familyInvitationTokenRepository: jest.Mocked<IFamilyInvitationTokenRepository>;
    familyRepository: jest.Mocked<IFamilyRepository>;
    mailService: jest.Mocked<IMailService>;
  };

  beforeEach(() => {
    mocks = createUserUseCaseMocks();

    userUseCase = new UserUseCase(
      mocks.userRepository,
      mocks.emailVerificationTokenRepository,
      mocks.familyInvitationTokenRepository,
      mocks.familyRepository,
      mocks.mailService
    );

    jest.clearAllMocks();
  });

  describe("inviteFamilyMember", () => {
    const inviteInput: InviteFamilyMemberInput = {
      email: "invited@example.com",
      role: "Child",
      inviterId: 1,
    };

    const mockInviter = createMockUser({
      id: 1,
      name: "Parent User",
      role: "Parent",
      familyId: 1,
    });

    const mockFamily = createMockFamily({
      id: 1,
      name: "Test Family",
    });

    it("正常に招待を送信できること", async () => {
      // モックのセットアップ
      mocks.userRepository.findByEmail.mockResolvedValue(null);
      mocks.userRepository.findById.mockResolvedValue(mockInviter);
      mocks.familyRepository.findById.mockResolvedValue(mockFamily);
      mocks.familyInvitationTokenRepository.deleteByEmail.mockResolvedValue();
      mocks.familyInvitationTokenRepository.save.mockImplementation(
        (token: FamilyInvitationToken) => {
          Object.defineProperty(token, "id", {
            value: 1,
            writable: true,
            enumerable: true,
          });
          return Promise.resolve(token);
        }
      );

      // テスト実行
      await userUseCase.inviteFamilyMember(inviteInput);

      // アサーション
      expect(mocks.userRepository.findByEmail).toHaveBeenCalledWith(
        inviteInput.email
      );
      expect(mocks.userRepository.findById).toHaveBeenCalledWith(
        inviteInput.inviterId
      );
      expect(
        mocks.familyInvitationTokenRepository.deleteByEmail
      ).toHaveBeenCalledWith(inviteInput.email, mockInviter.familyId);
      expect(mocks.familyRepository.findById).toHaveBeenCalledWith(
        mockInviter.familyId
      );
      expect(mocks.familyInvitationTokenRepository.save).toHaveBeenCalled();
      expect(mocks.mailService.sendFamilyInvitationEmail).toHaveBeenCalledWith(
        inviteInput.email,
        mockInviter.name,
        mockFamily.name,
        inviteInput.role,
        expect.any(String)
      );
    });

    it("すでに登録済みのメールアドレスの場合はエラーになること", async () => {
      // モックのセットアップ
      const existingUser = createMockUser({
        email: inviteInput.email,
      });
      mocks.userRepository.findByEmail.mockResolvedValue(existingUser);

      // テスト実行とアサーション
      await expect(userUseCase.inviteFamilyMember(inviteInput)).rejects.toThrow(
        new AppError(
          "ValidationError",
          "このメールアドレスは既に登録されています"
        )
      );

      // 以降の処理が呼ばれていないことを確認
      expect(mocks.userRepository.findById).not.toHaveBeenCalled();
    });

    it("招待者が存在しない場合はエラーになること", async () => {
      // モックのセットアップ
      mocks.userRepository.findByEmail.mockResolvedValue(null);
      mocks.userRepository.findById.mockResolvedValue(null);

      // テスト実行とアサーション
      await expect(userUseCase.inviteFamilyMember(inviteInput)).rejects.toThrow(
        new AppError("Unauthorized", "招待権限がありません")
      );

      // 以降の処理が呼ばれていないことを確認
      expect(
        mocks.familyInvitationTokenRepository.deleteByEmail
      ).not.toHaveBeenCalled();
    });

    it("招待者が親ロールでない場合はエラーになること", async () => {
      // モックのセットアップ
      const nonParentInviter = createMockUser({
        id: 1,
        role: "Child",
        familyId: 1,
      });
      mocks.userRepository.findByEmail.mockResolvedValue(null);
      mocks.userRepository.findById.mockResolvedValue(nonParentInviter);

      // テスト実行とアサーション
      await expect(userUseCase.inviteFamilyMember(inviteInput)).rejects.toThrow(
        new AppError("Unauthorized", "招待権限がありません")
      );

      // 以降の処理が呼ばれていないことを確認
      expect(
        mocks.familyInvitationTokenRepository.deleteByEmail
      ).not.toHaveBeenCalled();
    });

    it("招待者が家族に所属していない場合はエラーになること", async () => {
      // モックのセットアップ
      const inviterWithoutFamily = createMockUser({
        id: 1,
        role: "Parent",
        familyId: null,
      });
      mocks.userRepository.findByEmail.mockResolvedValue(null);
      mocks.userRepository.findById.mockResolvedValue(inviterWithoutFamily);

      // テスト実行とアサーション
      await expect(userUseCase.inviteFamilyMember(inviteInput)).rejects.toThrow(
        new AppError("ValidationError", "招待者が家族に所属していません")
      );

      // 以降の処理が呼ばれていないことを確認
      expect(
        mocks.familyInvitationTokenRepository.deleteByEmail
      ).not.toHaveBeenCalled();
    });

    it("家族が見つからない場合はエラーになること", async () => {
      // モックのセットアップ
      mocks.userRepository.findByEmail.mockResolvedValue(null);
      mocks.userRepository.findById.mockResolvedValue(mockInviter);
      mocks.familyRepository.findById.mockResolvedValue(null);

      // テスト実行とアサーション
      await expect(userUseCase.inviteFamilyMember(inviteInput)).rejects.toThrow(
        new AppError("NotFound", "指定された家族が見つかりません")
      );

      // 以降の処理が呼ばれていないことを確認
      expect(mocks.familyInvitationTokenRepository.save).not.toHaveBeenCalled();
      expect(
        mocks.mailService.sendFamilyInvitationEmail
      ).not.toHaveBeenCalled();
    });
  });

  describe("acceptInvitation", () => {
    const acceptInput = {
      token: "test-token",
      name: "Invited User",
      password: "validPassword123",
    };

    const mockInvitationToken = createMockFamilyInvitationToken({
      token: acceptInput.token,
      email: "invited@example.com",
      role: "Child",
      familyId: 1,
      inviterId: 1,
    });

    const mockFamily = createMockFamily({ id: 1 });

    it("新規ユーザーが正常に招待を受け入れられること", async () => {
      // モックのセットアップ
      mocks.familyInvitationTokenRepository.findByToken.mockResolvedValue(
        mockInvitationToken
      );
      mockInvitationToken.isExpired = jest.fn().mockReturnValue(false);
      mocks.familyRepository.findById.mockResolvedValue(mockFamily);
      mocks.userRepository.findByEmail.mockResolvedValue(null);
      mocks.userRepository.save.mockImplementation((user) =>
        Promise.resolve({ ...user, id: 100 } as User)
      );

      // テスト実行
      const result = await userUseCase.acceptInvitation(acceptInput);

      // アサーション
      expect(
        mocks.familyInvitationTokenRepository.findByToken
      ).toHaveBeenCalledWith(acceptInput.token);
      expect(mocks.familyRepository.findById).toHaveBeenCalledWith(
        mockInvitationToken.familyId
      );
      expect(mocks.userRepository.findByEmail).toHaveBeenCalledWith(
        mockInvitationToken.email
      );
      expect(mocks.userRepository.save).toHaveBeenCalled();
      expect(
        mocks.familyInvitationTokenRepository.deleteByToken
      ).toHaveBeenCalledWith(acceptInput.token);
      expect(result).toHaveProperty("id", 100);
      expect(result).toHaveProperty("name", acceptInput.name);
      expect(result).toHaveProperty("email", mockInvitationToken.email);
      expect(result).toHaveProperty("role", mockInvitationToken.role);
      expect(result).toHaveProperty("familyId", mockInvitationToken.familyId);
      expect(result).toHaveProperty("isVerified", true);
    });

    it("既存ユーザーが正常に招待を受け入れられること", async () => {
      // モックのセットアップ
      mocks.familyInvitationTokenRepository.findByToken.mockResolvedValue(
        mockInvitationToken
      );
      mockInvitationToken.isExpired = jest.fn().mockReturnValue(false);
      mocks.familyRepository.findById.mockResolvedValue(mockFamily);

      const existingUser = createMockUser({
        id: 50,
        email: mockInvitationToken.email,
        familyId: null, // まだ家族に所属していない
      });
      mocks.userRepository.findByEmail.mockResolvedValue(existingUser);

      mocks.userRepository.save.mockImplementation((user) =>
        Promise.resolve({ ...user, id: existingUser.id } as User)
      );

      // テスト実行
      const result = await userUseCase.acceptInvitation(acceptInput);

      // アサーション
      expect(mocks.userRepository.save).toHaveBeenCalled();
      expect(
        mocks.familyInvitationTokenRepository.deleteByToken
      ).toHaveBeenCalledWith(acceptInput.token);
      expect(result).toHaveProperty("id", existingUser.id);
      expect(result).toHaveProperty("familyId", mockInvitationToken.familyId);
    });

    it("招待トークンが無効な場合はエラーになること", async () => {
      // モックのセットアップ
      mocks.familyInvitationTokenRepository.findByToken.mockResolvedValue(null);

      // テスト実行とアサーション
      await expect(userUseCase.acceptInvitation(acceptInput)).rejects.toThrow(
        new AppError("ValidationError", "無効な招待トークンです")
      );
    });

    it("招待トークンの有効期限が切れている場合はエラーになること", async () => {
      // モックのセットアップ
      mocks.familyInvitationTokenRepository.findByToken.mockResolvedValue(
        mockInvitationToken
      );
      mockInvitationToken.isExpired = jest.fn().mockReturnValue(true);

      // テスト実行とアサーション
      await expect(userUseCase.acceptInvitation(acceptInput)).rejects.toThrow(
        new AppError("ValidationError", "招待の有効期限が切れています")
      );
      expect(
        mocks.familyInvitationTokenRepository.deleteByToken
      ).toHaveBeenCalledWith(acceptInput.token);
    });

    it("指定された家族が存在しない場合はエラーになること", async () => {
      // モックのセットアップ
      mocks.familyInvitationTokenRepository.findByToken.mockResolvedValue(
        mockInvitationToken
      );
      mockInvitationToken.isExpired = jest.fn().mockReturnValue(false);
      mocks.familyRepository.findById.mockResolvedValue(null);

      // テスト実行とアサーション
      await expect(userUseCase.acceptInvitation(acceptInput)).rejects.toThrow(
        new AppError("NotFound", "指定された家族が見つかりません")
      );
    });

    it("既存ユーザーがすでに家族に所属している場合はエラーになること", async () => {
      // モックのセットアップ
      mocks.familyInvitationTokenRepository.findByToken.mockResolvedValue(
        mockInvitationToken
      );
      mockInvitationToken.isExpired = jest.fn().mockReturnValue(false);
      mocks.familyRepository.findById.mockResolvedValue(mockFamily);

      const existingUser = createMockUser({
        email: mockInvitationToken.email,
        familyId: 2, // 別の家族に所属している
      });
      mocks.userRepository.findByEmail.mockResolvedValue(existingUser);

      // テスト実行とアサーション
      await expect(userUseCase.acceptInvitation(acceptInput)).rejects.toThrow(
        new AppError(
          "ValidationError",
          "このユーザーはすでに家族に所属しています"
        )
      );
    });
  });

  describe("resendInvitation", () => {
    const email = "reinvite@example.com";
    const familyId = 1;

    const mockInvitationToken = createMockFamilyInvitationToken({
      email,
      familyId,
      role: "Child",
      inviterId: 1,
    });

    const mockInviter = createMockUser({ id: 1, name: "Inviter" });
    const mockFamily = createMockFamily({ id: familyId, name: "Test Family" });

    it("正常に招待メールを再送信できること", async () => {
      // モックのセットアップ
      mocks.familyInvitationTokenRepository.findByEmail.mockResolvedValue(
        mockInvitationToken
      );
      mocks.userRepository.findById.mockResolvedValue(mockInviter);
      mocks.familyRepository.findById.mockResolvedValue(mockFamily);

      // テスト実行
      await userUseCase.resendInvitation(email, familyId);

      // アサーション
      expect(
        mocks.familyInvitationTokenRepository.findByEmail
      ).toHaveBeenCalledWith(email, familyId);
      expect(mocks.userRepository.findById).toHaveBeenCalledWith(
        mockInvitationToken.inviterId
      );
      expect(mocks.familyRepository.findById).toHaveBeenCalledWith(familyId);
      expect(
        mocks.familyInvitationTokenRepository.deleteByEmail
      ).toHaveBeenCalledWith(email, familyId);
      expect(mocks.familyInvitationTokenRepository.save).toHaveBeenCalled();
      expect(mocks.mailService.sendFamilyInvitationEmail).toHaveBeenCalledWith(
        email,
        mockInviter.name,
        mockFamily.name,
        mockInvitationToken.role,
        expect.any(String)
      );
    });

    it("招待が見つからない場合はエラーになること", async () => {
      // モックのセットアップ
      mocks.familyInvitationTokenRepository.findByEmail.mockResolvedValue(null);

      // テスト実行とアサーション
      await expect(
        userUseCase.resendInvitation(email, familyId)
      ).rejects.toThrow(
        new AppError("ValidationError", "招待が見つかりません")
      );
    });

    it("招待者が見つからない場合はエラーになること", async () => {
      // モックのセットアップ
      mocks.familyInvitationTokenRepository.findByEmail.mockResolvedValue(
        mockInvitationToken
      );
      mocks.userRepository.findById.mockResolvedValue(null);

      // テスト実行とアサーション
      await expect(
        userUseCase.resendInvitation(email, familyId)
      ).rejects.toThrow(new AppError("NotFound", "招待者が見つかりません"));
    });

    it("家族が見つからない場合はエラーになること", async () => {
      // モックのセットアップ
      mocks.familyInvitationTokenRepository.findByEmail.mockResolvedValue(
        mockInvitationToken
      );
      mocks.userRepository.findById.mockResolvedValue(mockInviter);
      mocks.familyRepository.findById.mockResolvedValue(null);

      // テスト実行とアサーション
      await expect(
        userUseCase.resendInvitation(email, familyId)
      ).rejects.toThrow(
        new AppError("NotFound", "指定された家族が見つかりません")
      );
    });
  });
});
