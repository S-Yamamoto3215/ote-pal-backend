import request from "supertest";
import express, { NextFunction, Request, Response } from "express";

import { UserController } from "@/interface/controllers/UserController";
import { IUserUseCase } from "@/application/usecases/UserUseCase";

import { userSeeds } from "@tests/resources/User/UserSeeds";

const mockUserUseCase: IUserUseCase = {
  findAllByFamilyId: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

const app = express();
app.use(express.json());
const userController = new UserController(mockUserUseCase);

app.get("/users", (req, res, next) =>
  userController.getAllUsers(req, res, next)
);
app.get("/users/:userId", (req, res, next) =>
  userController.getUserById(req, res, next)
);
app.post("/users", (req, res, next) =>
  userController.createUser(req, res, next)
);
app.put("/users", (req, res, next) =>
  userController.updateUser(req, res, next)
);
app.delete("/users", (req, res, next) =>
  userController.deleteUser(req, res, next)
);

describe("UserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get all users by familyId", async () => {
    const mockUsers = userSeeds;
    (mockUserUseCase.findAllByFamilyId as jest.Mock).mockResolvedValue(
      mockUsers
    );

    const response = await request(app).get("/users").send({ familyId: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUsers);
    expect(mockUserUseCase.findAllByFamilyId).toHaveBeenCalledWith(1);
  });

  it("should get user by userId", async () => {
    const mockUser = userSeeds[0];
    (mockUserUseCase.getUserById as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).get("/users/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(mockUserUseCase.getUserById).toHaveBeenCalledWith(1);
  });

  it("should create a user", async () => {
    const mockUser = userSeeds[0];
    (mockUserUseCase.createUser as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).post("/users").send({
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
      role: "Parent",
      familyId: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(mockUserUseCase.createUser).toHaveBeenCalledWith({
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
      role: "Parent",
      familyId: 1,
    });
  });

  it("should update a user", async () => {
    const mockUser = userSeeds[0];
    (mockUserUseCase.updateUser as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).put("/users").send({
      userId: 1,
      name: "Updated User",
      email: "updated@example.com",
      password: "newpassword",
      role: "Parent",
      familyId: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(mockUserUseCase.updateUser).toHaveBeenCalledWith(1, {
      name: "Updated User",
      email: "updated@example.com",
      password: "newpassword",
      role: "Parent",
      familyId: 1,
    });
  });

  it("should delete a user", async () => {
    (mockUserUseCase.deleteUser as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).delete("/users").send({
      userId: 1,
    });

    expect(response.status).toBe(204);
    expect(mockUserUseCase.deleteUser).toHaveBeenCalledWith(1);
  });

  it("should handle errors and pass them to next function", async () => {
    const error = new Error("Something went wrong");
    (mockUserUseCase.getUserById as jest.Mock).mockRejectedValue(error);

    const next = jest.fn();
    const req = { params: { userId: "1" } } as unknown as Request;
    const res = {} as Response;

    await userController.getUserById(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
