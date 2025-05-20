import { Request, Response } from "express";
import { AuthController } from "@/interface/controllers/AuthController";
import { IAuthUseCase } from "@/application/usecases/AuthUseCase";
import {
  createMockRequest,
  createMockResponse,
  createMockNext,
  expectErrorToBeCalled
} from "@tests/helpers/controllers";

describe("AuthController", () => {
  let authUseCase: jest.Mocked<IAuthUseCase>;
  let authController: AuthController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    authUseCase = {
      login: jest.fn(),
    };

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

    it("should call next with validation error when email or password is missing", async () => {
      // Arrange
      req.body = {};

      // Act
      await authController.login(req as Request, res as Response, next);

      // Assert
      expect(authUseCase.login).not.toHaveBeenCalled();
      expectErrorToBeCalled(next, "ValidationError", "Email and password are required");
    });
  });
});
