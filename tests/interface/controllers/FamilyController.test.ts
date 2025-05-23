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
});
