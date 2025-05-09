import { Request, Response, NextFunction } from "express";
import { UserController } from "@/interface/controllers/UserController";

import { IUserUseCase } from "@/application/usecases/UserUseCase";

import { AppError } from "@/infrastructure/errors/AppError";

import { parentUser, childUser1 } from "@tests/resources/User/UserEntitys";
import { User } from "@/domain/entities/User";
import { Password } from "@/domain/valueObjects/Password";

describe("UserController", () => {
  let userUseCase: jest.Mocked<IUserUseCase>;

  let userController: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    userUseCase = {
      createUser: jest.fn(),
      createUserWithFamily: jest.fn(),
      registerUser: jest.fn(),
      verifyEmail: jest.fn(),
      resendVerificationEmail: jest.fn(),
    };

    userController = new UserController(userUseCase);

    req = {
      body: {},
      query: {},
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  describe("createUser", () => {
    it("should create a new user and return status 201", async () => {
      const mockUser = parentUser;
      req.body = mockUser;

      userUseCase.createUser.mockResolvedValue(mockUser);

      await userController.createUser(req as Request, res as Response, next);

      expect(userUseCase.createUser).toHaveBeenCalledWith({
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        role: mockUser.role,
        familyId: mockUser.familyId,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should call next with an error if user creation fails", async () => {
      req.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password1234",
        role: "Parent",
        familyId: 1,
      };

      const error = new AppError("ValidationError", "User already exists");
      userUseCase.createUser.mockRejectedValue(error);

      await userController.createUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should call next with a validation error if required fields are missing", async () => {
      req.body = {};

      await userController.createUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Missing required fields"),
        })
      );
      expect(userUseCase.createUser).not.toHaveBeenCalled();
    });
  });

  describe("registerUser", () => {
    it("should register a new user and return status 201", async () => {
      req.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      // 登録されたユーザーを作成
      const mockUser = new User(
        req.body.name,
        req.body.email,
        new Password(req.body.password),
        "Parent",
        false,
        null
      );
      mockUser.id = 1;

      userUseCase.registerUser.mockResolvedValue(mockUser);

      await userController.registerUser(req as Request, res as Response, next);

      expect(userUseCase.registerUser).toHaveBeenCalledWith({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser.id);
    });

    it("should call next with an error if user registration fails", async () => {
      req.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const error = new AppError("ValidationError", "User already exists");
      userUseCase.registerUser.mockRejectedValue(error);

      await userController.registerUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should call next with a validation error if required fields are missing", async () => {
      req.body = { name: "Test User" }; // メールとパスワードがない

      await userController.registerUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Missing required fields"),
        })
      );
      expect(userUseCase.registerUser).not.toHaveBeenCalled();
    });
  });

  describe("verifyEmail", () => {
    it("should verify email successfully and return status 200", async () => {
      req.query = { token: "valid-token" };

      // 検証済みのユーザーを作成
      const verifiedUser = new User(
        "Test User",
        "test@example.com",
        new Password("password123"),
        "Parent",
        true, // 検証済み
        null
      );
      verifiedUser.id = 1;

      userUseCase.verifyEmail.mockResolvedValue(verifiedUser);

      await userController.verifyEmail(req as Request, res as Response, next);

      expect(userUseCase.verifyEmail).toHaveBeenCalledWith("valid-token");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email verified successfully"
      });
    });

    it("should call next with an error if email verification fails", async () => {
      req.query = { token: "invalid-token" };

      const error = new AppError("ValidationError", "Invalid verification token");
      userUseCase.verifyEmail.mockRejectedValue(error);

      await userController.verifyEmail(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should call next with a validation error if token is missing", async () => {
      req.query = {}; // トークンがない

      await userController.verifyEmail(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Token is required",
        })
      );
      expect(userUseCase.verifyEmail).not.toHaveBeenCalled();
    });

    it("should call next with a validation error if token is not a string", async () => {
      req.query = { token: ["invalid-token-array"] as any };

      await userController.verifyEmail(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Token is required",
        })
      );
      expect(userUseCase.verifyEmail).not.toHaveBeenCalled();
    });
  });

  describe("resendVerificationEmail", () => {
    it("should resend verification email successfully and return status 200", async () => {
      req.body = { email: "test@example.com" };

      userUseCase.resendVerificationEmail.mockResolvedValue();

      await userController.resendVerificationEmail(req as Request, res as Response, next);

      expect(userUseCase.resendVerificationEmail).toHaveBeenCalledWith("test@example.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Verification email resent successfully",
      });
    });

    it("should call next with an error if resending verification email fails", async () => {
      req.body = { email: "test@example.com" };

      const error = new AppError("ValidationError", "User not found");
      userUseCase.resendVerificationEmail.mockRejectedValue(error);

      await userController.resendVerificationEmail(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should call next with a validation error if email is missing", async () => {
      req.body = {}; // メールがない

      await userController.resendVerificationEmail(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Missing required field: email",
        })
      );
      expect(userUseCase.resendVerificationEmail).not.toHaveBeenCalled();
    });
  });
});
