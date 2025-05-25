import { Request, Response } from "express";
import { FamilyController } from "@/interface/controllers/FamilyController";
import { IFamilyUseCase } from "@/application/usecases/FamilyUseCase";
import { AppError } from "@/infrastructure/errors/AppError";
import { createMockFamily } from "@tests/helpers/factories";
import {
  createMockRequest,
  createMockResponse,
  createMockNext,
  expectMissingFieldsErrorToBeCalled,
  expectErrorToBeCalled
} from "@tests/helpers/controllers";
import { createMockFamilyUseCase } from "@tests/helpers/mocks";

describe("FamilyController", () => {
  let familyUseCase: jest.Mocked<IFamilyUseCase>;
  let familyController: FamilyController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    familyUseCase = createMockFamilyUseCase();
    familyController = new FamilyController(familyUseCase);

    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  describe("createFamily", () => {
    it("should return status 201 with family data when valid input is provided", async () => {
      // Arrange
      const mockFamily = createMockFamily({
        name: "山田家",
        payment_schedule: 1
      });

      req.body = {
        name: "山田家",
        paymentSchedule: 1,
        userId: 1
      };

      familyUseCase.createFamily.mockResolvedValue(mockFamily);

      // Act
      await familyController.createFamily(req as Request, res as Response, next);

      // Assert
      expect(familyUseCase.createFamily).toHaveBeenCalledWith({
        name: req.body.name,
        paymentSchedule: req.body.paymentSchedule,
        userId: req.body.userId
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockFamily);
    });

    it("should call next with validation error when required fields are missing", async () => {
      // Arrange
      req.body = { name: "山田家" };

      // Act
      await familyController.createFamily(req as Request, res as Response, next);

      // Assert
      expectMissingFieldsErrorToBeCalled(next, "name", "paymentSchedule", "userId");
      expect(familyUseCase.createFamily).not.toHaveBeenCalled();
    });

    it("should call next with use case error when family creation fails", async () => {
      // Arrange
      req.body = {
        name: "山田家",
        paymentSchedule: 1,
        userId: 1
      };

      const error = new AppError("ValidationError", "User already belongs to a family");
      familyUseCase.createFamily.mockRejectedValue(error);

      // Act
      await familyController.createFamily(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });

    it("should call next with NotFound error when user does not exist", async () => {
      // Arrange
      req.body = {
        name: "山田家",
        paymentSchedule: 1,
        userId: 999 // 存在しないユーザーID
      };

      const error = new AppError("NotFound", "User not found");
      familyUseCase.createFamily.mockRejectedValue(error);

      // Act
      await familyController.createFamily(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
      expect(familyUseCase.createFamily).toHaveBeenCalledWith({
        name: req.body.name,
        paymentSchedule: req.body.paymentSchedule,
        userId: req.body.userId
      });
    });

    it("should call next with Unauthorized error when user is not verified", async () => {
      // Arrange
      req.body = {
        name: "山田家",
        paymentSchedule: 1,
        userId: 2 // 未認証のユーザーID
      };

      const error = new AppError("Unauthorized", "User is not verified");
      familyUseCase.createFamily.mockRejectedValue(error);

      // Act
      await familyController.createFamily(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getFamilyById", () => {
    const familyId = 1;
    const userId = 1;
    const mockFamilyDetail = {
      name: "山田家",
      paymentSchedule: 15,
      users: [
        { userId: 1, userName: "親ユーザー" },
        { userId: 2, userName: "子ユーザー" }
      ]
    };

    beforeEach(() => {
      req.params = { family_id: familyId.toString() };
      req.user = { id: userId, email: "test@example.com", role: "Parent" };
    });

    it("正常な入力で家族情報を返すこと", async () => {
      // Arrange
      familyUseCase.getFamilyDetailById.mockResolvedValue(mockFamilyDetail);

      // Act
      await familyController.getFamilyById(req as Request, res as Response, next);

      // Assert
      expect(familyUseCase.getFamilyDetailById).toHaveBeenCalledWith(familyId, userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFamilyDetail);
    });

    it("無効な家族IDの場合にバリデーションエラーを返すこと", async () => {
      // Arrange
      req.params = { family_id: "invalid" };

      // Act
      await familyController.getFamilyById(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.errorType).toBe("ValidationError");
      expect(error.message).toBe("Invalid family ID");
      expect(familyUseCase.getFamilyDetailById).not.toHaveBeenCalled();
    });

    it("家族IDが未指定の場合にバリデーションエラーを返すこと", async () => {
      // Arrange
      req.params = {}; // family_idが未指定

      // Act
      await familyController.getFamilyById(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.errorType).toBe("ValidationError");
      expect(error.message).toBe("Invalid family ID");
      expect(familyUseCase.getFamilyDetailById).not.toHaveBeenCalled();
    });

    it("認証されていない場合にUnauthorizedエラーを返すこと", async () => {
      // Arrange
      req.user = undefined;

      // Act
      await familyController.getFamilyById(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.errorType).toBe("Unauthorized");
      expect(error.message).toBe("Authentication required");
      expect(familyUseCase.getFamilyDetailById).not.toHaveBeenCalled();
    });

    it("req.userにidが含まれていない場合にUnauthorizedエラーを返すこと", async () => {
      // Arrange
      req.user = { id: undefined as any, email: "test@example.com", role: "Parent" }; // idが未指定

      // Act
      await familyController.getFamilyById(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.errorType).toBe("Unauthorized");
      expect(error.message).toBe("Authentication required");
      expect(familyUseCase.getFamilyDetailById).not.toHaveBeenCalled();
    });

    it("ユーザーが家族に所属していない場合にForbiddenエラーが伝搬されること", async () => {
      // Arrange
      const error = new AppError("Forbidden", "User does not belong to this family");
      familyUseCase.getFamilyDetailById.mockRejectedValue(error);

      // Act
      await familyController.getFamilyById(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
      expect(familyUseCase.getFamilyDetailById).toHaveBeenCalledWith(familyId, userId);
    });

    it("家族が見つからない場合にNotFoundエラーが伝搬されること", async () => {
      // Arrange
      const error = new AppError("NotFound", "Family not found");
      familyUseCase.getFamilyDetailById.mockRejectedValue(error);

      // Act
      await familyController.getFamilyById(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
      expect(familyUseCase.getFamilyDetailById).toHaveBeenCalledWith(familyId, userId);
    });

    it("データベースエラーが発生した場合にエラーが伝搬されること", async () => {
      // Arrange
      const error = new AppError("DatabaseError", "Database error");
      familyUseCase.getFamilyDetailById.mockRejectedValue(error);

      // Act
      await familyController.getFamilyById(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
      expect(familyUseCase.getFamilyDetailById).toHaveBeenCalledWith(familyId, userId);
    });
  });

  describe("updateFamilyName", () => {
    const familyId = 1;
    const userId = 1;
    const newName = "新しい家族名";

    beforeEach(() => {
      req.params = { family_id: familyId.toString() };
      req.user = { id: userId, email: "test@example.com", role: "Parent" };
      req.body = { name: newName };
    });

    it("有効なリクエストでfamily名が更新されること", async () => {
      // Arrange
      const updatedFamily = createMockFamily({
        id: familyId,
        name: newName,
        payment_schedule: 15
      });
      familyUseCase.updateFamilyName.mockResolvedValue(updatedFamily);

      // Act
      await familyController.updateFamilyName(req as Request, res as Response, next);

      // Assert
      expect(familyUseCase.updateFamilyName).toHaveBeenCalledWith(newName, familyId, userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedFamily);
      expect(next).not.toHaveBeenCalled();
    });

    it("nameがリクエストボディにない場合にValidationErrorを返すこと", async () => {
      // Arrange
      req.body = {}; // nameなし

      // Act
      await familyController.updateFamilyName(req as Request, res as Response, next);

      // Assert
      expectErrorToBeCalled(
        next,
        "ValidationError",
        "Missing required fields: name"
      );
      expect(familyUseCase.updateFamilyName).not.toHaveBeenCalled();
    });

    it("無効なfamily_idでValidationErrorを返すこと", async () => {
      // Arrange
      req.params = { family_id: "invalid" };

      // Act
      await familyController.updateFamilyName(req as Request, res as Response, next);

      // Assert
      expectErrorToBeCalled(
        next,
        "ValidationError",
        "Invalid family ID"
      );
      expect(familyUseCase.updateFamilyName).not.toHaveBeenCalled();
    });

    it("認証されていない場合にUnauthorizedエラーを返すこと", async () => {
      // Arrange
      req.user = undefined;

      // Act
      await familyController.updateFamilyName(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.errorType).toBe("Unauthorized");
      expect(error.message).toBe("Authentication required");
      expect(familyUseCase.updateFamilyName).not.toHaveBeenCalled();
    });

    it("権限がない場合にForbiddenエラーが伝搬されること", async () => {
      // Arrange
      const error = new AppError("Forbidden", "User does not have permission to update family name");
      familyUseCase.updateFamilyName.mockRejectedValue(error);

      // Act
      await familyController.updateFamilyName(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
      expect(familyUseCase.updateFamilyName).toHaveBeenCalledWith(newName, familyId, userId);
    });

    it("家族が見つからない場合にNotFoundエラーが伝搬されること", async () => {
      // Arrange
      const error = new AppError("NotFound", "Family not found");
      familyUseCase.updateFamilyName.mockRejectedValue(error);

      // Act
      await familyController.updateFamilyName(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
      expect(familyUseCase.updateFamilyName).toHaveBeenCalledWith(newName, familyId, userId);
    });
  });

  describe("updateFamilyPaymentSchedule", () => {
    const familyId = 1;
    const userId = 1;
    const newPaymentSchedule = 25;

    beforeEach(() => {
      req.params = { family_id: familyId.toString() };
      req.user = { id: userId, email: "test@example.com", role: "Parent" };
      req.body = { paymentSchedule: newPaymentSchedule };
    });

    it("有効なリクエストで支払日が更新されること", async () => {
      // Arrange
      const updatedFamily = createMockFamily({
        id: familyId,
        name: "テスト家族",
        payment_schedule: newPaymentSchedule
      });
      familyUseCase.updateFamilyPaymentSchedule.mockResolvedValue(updatedFamily);

      // Act
      await familyController.updateFamilyPaymentSchedule(req as Request, res as Response, next);

      // Assert
      expect(familyUseCase.updateFamilyPaymentSchedule).toHaveBeenCalledWith(newPaymentSchedule, familyId, userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedFamily);
      expect(next).not.toHaveBeenCalled();
    });

    it("paymentScheduleがリクエストボディにない場合にValidationErrorを返すこと", async () => {
      // Arrange
      req.body = {}; // paymentScheduleなし

      // Act
      await familyController.updateFamilyPaymentSchedule(req as Request, res as Response, next);

      // Assert
      expectErrorToBeCalled(
        next,
        "ValidationError",
        "Missing required fields: paymentSchedule"
      );
      expect(familyUseCase.updateFamilyPaymentSchedule).not.toHaveBeenCalled();
    });

    it("paymentScheduleが範囲外の場合にValidationErrorを返すこと", async () => {
      // Arrange - 範囲外の値をテスト
      req.body = { paymentSchedule: 32 }; // 31日を超える

      // Act
      await familyController.updateFamilyPaymentSchedule(req as Request, res as Response, next);

      // Assert
      expectErrorToBeCalled(
        next,
        "ValidationError",
        "Payment schedule must be between 1 and 31"
      );
      expect(familyUseCase.updateFamilyPaymentSchedule).not.toHaveBeenCalled();
    });

    it("無効なfamily_idでValidationErrorを返すこと", async () => {
      // Arrange
      req.params = { family_id: "invalid" };

      // Act
      await familyController.updateFamilyPaymentSchedule(req as Request, res as Response, next);

      // Assert
      expectErrorToBeCalled(
        next,
        "ValidationError",
        "Invalid family ID"
      );
      expect(familyUseCase.updateFamilyPaymentSchedule).not.toHaveBeenCalled();
    });

    it("認証されていない場合にUnauthorizedエラーを返すこと", async () => {
      // Arrange
      req.user = undefined;

      // Act
      await familyController.updateFamilyPaymentSchedule(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.errorType).toBe("Unauthorized");
      expect(error.message).toBe("Authentication required");
      expect(familyUseCase.updateFamilyPaymentSchedule).not.toHaveBeenCalled();
    });

    it("権限がない場合にForbiddenエラーが伝搬されること", async () => {
      // Arrange
      const error = new AppError("Forbidden", "User does not have permission to update family payment schedule");
      familyUseCase.updateFamilyPaymentSchedule.mockRejectedValue(error);

      // Act
      await familyController.updateFamilyPaymentSchedule(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
      expect(familyUseCase.updateFamilyPaymentSchedule).toHaveBeenCalledWith(newPaymentSchedule, familyId, userId);
    });

    it("家族が見つからない場合にNotFoundエラーが伝搬されること", async () => {
      // Arrange
      const error = new AppError("NotFound", "Family not found");
      familyUseCase.updateFamilyPaymentSchedule.mockRejectedValue(error);

      // Act
      await familyController.updateFamilyPaymentSchedule(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
      expect(familyUseCase.updateFamilyPaymentSchedule).toHaveBeenCalledWith(newPaymentSchedule, familyId, userId);
    });
  });
});
