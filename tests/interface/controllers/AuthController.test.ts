import { Request, Response } from "express";
import { AuthController } from "@/interface/controllers/AuthController";
import { IAuthUseCase } from "@/application/usecases/AuthUseCase";
import {
  createMockRequest,
  createMockResponse,
  createMockNext
} from "@tests/helpers/controllers";
import { createMockAuthUseCase } from "@tests/helpers/mocks";

describe("AuthController", () => {
  let authUseCase: jest.Mocked<IAuthUseCase>;
  let authController: AuthController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    authUseCase = createMockAuthUseCase();
    authController = new AuthController(authUseCase);

    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  describe("login", () => {
    it("should return token when valid credentials are provided", async () => {
      // Arrange
      req.body = { email: "test@example.com", password: "password1234" };
      authUseCase.login.mockResolvedValue("mock-token");

      // Act
      await authController.login(req as Request, res as Response, next);

      // Assert
      expect(authUseCase.login).toHaveBeenCalledWith(
        "test@example.com",
        "password1234",
      );
      expect(res.json).toHaveBeenCalledWith({ token: "mock-token" });
    });

    it("should call next with use case error when login fails", async () => {
      // Arrange
      req.body = { email: "test@example.com", password: "password1234" };
      const error = new Error("Login failed");
      authUseCase.login.mockRejectedValue(error);

      // Act
      await authController.login(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });

    // バリデーションはミドルウェアに移行したため、このテストは不要
    // コントローラーはバリデーション済みのデータを受け取る前提になる
  });
});
