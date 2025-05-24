import { Request, Response } from "express";
import { UserInvitationController } from "@/interface/controllers/UserInvitationController/UserInvitationController";
import { IUserUseCase } from "@/application/usecases/UserUseCase";
import { AppError } from "@/infrastructure/errors/AppError";
import { createMockUser } from "@tests/helpers/factories";
import {
  createMockRequest,
  createMockResponse,
  createMockNext,
  expectErrorToBeCalled
} from "@tests/helpers/controllers";
import { createMockUserUseCase } from "@tests/helpers/mocks";

describe("UserInvitationController", () => {
  let userUseCase: jest.Mocked<IUserUseCase>;
  let userInvitationController: UserInvitationController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    userUseCase = createMockUserUseCase();
    userInvitationController = new UserInvitationController(userUseCase);

    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  describe("inviteMember", () => {
    it("認証されていない場合、401エラーを返すこと", async () => {
      // Arrange
      req.user = undefined;

      // Act
      await userInvitationController.inviteMember(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "認証が必要です" });
    });

    it("招待が成功した場合、成功メッセージを返すこと", async () => {
      // Arrange
      req.user = { id: 1, email: "parent@example.com", role: "Parent" };
      req.body = {
        email: "invited@example.com",
        role: "Child",
        familyId: 1
      };
      userUseCase.inviteFamilyMember.mockResolvedValueOnce();

      // Act
      await userInvitationController.inviteMember(req as Request, res as Response, next);

      // Assert
      expect(userUseCase.inviteFamilyMember).toHaveBeenCalledWith({
        email: "invited@example.com",
        role: "Child",
        familyId: 1,
        inviterId: 1
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "招待メールが送信されました" });
    });

    it("エラーが発生した場合、エラーハンドラに渡すこと", async () => {
      // Arrange
      req.user = { id: 1, email: "parent@example.com", role: "Parent" };
      req.body = {
        email: "invited@example.com",
        role: "Child",
        familyId: 1
      };
      const error = new AppError("ValidationError", "このユーザーはすでに家族のメンバーです");
      userUseCase.inviteFamilyMember.mockRejectedValueOnce(error);

      // Act
      await userInvitationController.inviteMember(req as Request, res as Response, next);

      // Assert
      expectErrorToBeCalled(next, "ValidationError", "このユーザーはすでに家族のメンバーです");
    });
  });

  describe("acceptInvitation", () => {
    it("招待の受け入れが成功した場合、ユーザー情報と成功メッセージを返すこと", async () => {
      // Arrange
      req.body = {
        token: "valid-token",
        name: "Invited User",
        password: "validPassword123"
      };
      const mockUser = createMockUser({
        id: 100,
        name: "Invited User",
        email: "invited@example.com",
        role: "Child",
        familyId: 1,
        isVerified: true
      });
      userUseCase.acceptInvitation.mockResolvedValueOnce(mockUser);

      // Act
      await userInvitationController.acceptInvitation(req as Request, res as Response, next);

      // Assert
      expect(userUseCase.acceptInvitation).toHaveBeenCalledWith({
        token: "valid-token",
        name: "Invited User",
        password: "validPassword123"
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "家族グループへの参加が完了しました",
        user: {
          id: 100,
          name: "Invited User",
          email: "invited@example.com",
          role: "Child",
          isVerified: true,
          familyId: 1
        }
      });
    });

    it("エラーが発生した場合、エラーハンドラに渡すこと", async () => {
      // Arrange
      req.body = {
        token: "invalid-token",
        name: "Invited User",
        password: "validPassword123"
      };
      const error = new AppError("ValidationError", "無効な招待トークンです");
      userUseCase.acceptInvitation.mockRejectedValueOnce(error);

      // Act
      await userInvitationController.acceptInvitation(req as Request, res as Response, next);

      // Assert
      expectErrorToBeCalled(next, "ValidationError", "無効な招待トークンです");
    });
  });

  describe("resendInvitation", () => {
    it("認証されていない場合、401エラーを返すこと", async () => {
      // Arrange
      req.user = undefined;

      // Act
      await userInvitationController.resendInvitation(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "認証が必要です" });
    });

    it("招待メールの再送信が成功した場合、成功メッセージを返すこと", async () => {
      // Arrange
      req.user = { id: 1, email: "parent@example.com", role: "Parent" };
      req.body = {
        email: "reinvite@example.com",
        familyId: 1
      };
      userUseCase.resendInvitation.mockResolvedValueOnce();

      // Act
      await userInvitationController.resendInvitation(req as Request, res as Response, next);

      // Assert
      expect(userUseCase.resendInvitation).toHaveBeenCalledWith("reinvite@example.com", 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "招待メールが再送信されました" });
    });

    it("エラーが発生した場合、エラーハンドラに渡すこと", async () => {
      // Arrange
      req.user = { id: 1, email: "parent@example.com", role: "Parent" };
      req.body = {
        email: "reinvite@example.com",
        familyId: 1
      };
      const error = new AppError("ValidationError", "招待が見つかりません");
      userUseCase.resendInvitation.mockRejectedValueOnce(error);

      // Act
      await userInvitationController.resendInvitation(req as Request, res as Response, next);

      // Assert
      expectErrorToBeCalled(next, "ValidationError", "招待が見つかりません");
    });
  });
});
