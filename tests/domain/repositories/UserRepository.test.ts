import { DataSource, Repository } from "typeorm";

import { User } from "@/domain/entities/User";
import { Family } from "@/domain/entities/Family";
import { UserRepository } from "@/domain/repositories/UserRepository/UserRepository";
import { AppError } from "@/infrastructure/errors/AppError";

import { createTestDatabase, closeTestDataSource } from "@tests/utils/database/setupTestDatabase";
import { seedDatabase } from "@tests/utils/database/seedDatabase";

let dataSource: DataSource;
let userRepository: UserRepository;

beforeAll(async () => {
  dataSource = await createTestDatabase();
  await seedDatabase(dataSource);
  userRepository = new UserRepository(dataSource);
});

afterAll(async () => {
  await closeTestDataSource();
});

describe("UserRepository", () => {
  describe("save", () => {
    it("should save a user", async () => {
      const initialCount = await dataSource.getRepository(User).count();

      const family = await dataSource.getRepository(Family).findOne({where: {id: 1}});
      const newUser = new User(
        family!,
        "Test User",
        "testuser1@exsample.com",
        "password1234",
        "Parent"
      );
      const createdUser = await userRepository.save(newUser);
      const finalCount = await dataSource.getRepository(User).count();

      expect(createdUser).toBe(newUser);
      expect(finalCount).toBe(initialCount + 1);
    });

    // it("should throw an error if save fails", async () => {
    //   const user = new User();
    //   userRepoMock.save.mockRejectedValue(new Error("Save failed"));

    //   await expect(userRepository.save(user)).rejects.toThrow(AppError);
    //   await expect(userRepository.save(user)).rejects.toThrow("Failed to save user");
    // });
  });

  describe("findById", () => {
    // it("should find a user by id", async () => {
    //   const user = new User();
    //   userRepoMock.findOneBy.mockResolvedValue(user);

    //   const result = await userRepository.findById(1);

    //   expect(result).toBe(user);
    //   expect(userRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    // });

    // it("should return null if user not found", async () => {
    //   userRepoMock.findOneBy.mockResolvedValue(null);

    //   const result = await userRepository.findById(1);

    //   expect(result).toBeNull();
    //   expect(userRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    // });

    // it("should throw an error if findById fails", async () => {
    //   userRepoMock.findOneBy.mockRejectedValue(new Error("Find failed"));

    //   await expect(userRepository.findById(1)).rejects.toThrow(AppError);
    //   await expect(userRepository.findById(1)).rejects.toThrow("Failed to find user");
    // });
  });

  describe("findByEmail", () => {
    // it("should find a user by email", async () => {
    //   const user = new User();
    //   userRepoMock.findOneBy.mockResolvedValue(user);

    //   const result = await userRepository.findByEmail("test@example.com");

    //   expect(result).toBe(user);
    //   expect(userRepoMock.findOneBy).toHaveBeenCalledWith({ email: "test@example.com" });
    // });

    // it("should return null if user not found", async () => {
    //   userRepoMock.findOneBy.mockResolvedValue(null);

    //   const result = await userRepository.findByEmail("test@example.com");

    //   expect(result).toBeNull();
    //   expect(userRepoMock.findOneBy).toHaveBeenCalledWith({ email: "test@example.com" });
    // });

    // it("should throw an error if findByEmail fails", async () => {
    //   userRepoMock.findOneBy.mockRejectedValue(new Error("Find failed"));

    //   await expect(userRepository.findByEmail("test@example.com")).rejects.toThrow(AppError);
    //   await expect(userRepository.findByEmail("test@example.com")).rejects.toThrow("Failed to find user");
    // });
  });

  describe("findAllByFamily", () => {
    // it("should find all users by family", async () => {
    //   const family = new Family();
    //   const users = [new User(), new User()];
    //   userRepoMock.find.mockResolvedValue(users);

    //   const result = await userRepository.findAllByFamily(family);

    //   expect(result).toBe(users);
    //   expect(userRepoMock.find).toHaveBeenCalledWith({ where: { family } });
    // });

    // it("should throw an error if findAllByFamily fails", async () => {
    //   const family = new Family();
    //   userRepoMock.find.mockRejectedValue(new Error("Find failed"));

    //   await expect(userRepository.findAllByFamily(family)).rejects.toThrow(AppError);
    //   await expect(userRepository.findAllByFamily(family)).rejects.toThrow("failed to find users");
    // });
  });

  describe("delete", () => {
    // it("should delete a user by id", async () => {
    //   userRepoMock.delete.mockResolvedValue({} as any);

    //   await userRepository.delete(1);

    //   expect(userRepoMock.delete).toHaveBeenCalledWith(1);
    // });

    // it("should throw an error if delete fails", async () => {
    //   userRepoMock.delete.mockRejectedValue(new Error("Delete failed"));

    //   await expect(userRepository.delete(1)).rejects.toThrow(AppError);
    //   await expect(userRepository.delete(1)).rejects.toThrow("failed to delete user");
    // });
  });
});
