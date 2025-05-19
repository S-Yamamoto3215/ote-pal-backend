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

  it("should return a token for valid credentials", async () => {
    req.body = { email: "test@example.com", password: "password1234" };
    authUseCase.login.mockResolvedValue("mock-token");

    await authController.login(req as Request, res as Response, next);

    expect(authUseCase.login).toHaveBeenCalledWith(
      "test@example.com",
      "password1234",
    );
    expect(res.json).toHaveBeenCalledWith({ token: "mock-token" });
  });

  it("should call next with an error if authUseCase.login throws", async () => {
    req.body = { email: "test@example.com", password: "password1234" };
    const error = new Error("Login failed");
    authUseCase.login.mockRejectedValue(error);

    await authController.login(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should call next with a validation error if email or password is missing", async () => {
    req.body = {};

    await authController.login(req as Request, res as Response, next);

    expect(authUseCase.login).not.toHaveBeenCalled();
    expectErrorToBeCalled(next, "ValidationError", "Email and password are required");
  });
});
