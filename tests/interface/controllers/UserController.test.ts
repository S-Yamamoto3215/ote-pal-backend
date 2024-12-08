import { Request, Response, NextFunction } from "express";
import { UserController } from "@/interface/controllers/UserController";

import { IUserUseCase } from "@/application/usecases/UserUseCase";

import { AppError } from "@/infrastructure/errors/AppError";

import { parentUser } from "@tests/resources/User/UserEntitys";

describe("UserController", () => {
  let userUseCase: jest.Mocked<IUserUseCase>;

  let userController: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    userUseCase = {
      createUser: jest.fn(),
    };

    userController = new UserController(userUseCase);

    req = {
      body: {},
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

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

    const error = new AppError(
      "ValidationError",
      "Missing required fields: name, email, password, role, familyId",
    );

    userUseCase.createUser.mockRejectedValue(error);

    await userController.createUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(userUseCase.createUser).not.toHaveBeenCalled();
  });
});
