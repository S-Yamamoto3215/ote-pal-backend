import { Family } from "@/domain/entities/Family";
import { IFamilyRepository } from "@/domain/repositories/FamilyRepository";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { FamilyUseCase } from "@/application/usecases/FamilyUseCase/FamilyUseCase";
import { AppError } from "@/infrastructure/errors/AppError";
import { createMockFamily, createMockUser } from "@tests/helpers/factories";

describe("FamilyUseCase", () => {
  let familyRepository: jest.Mocked<IFamilyRepository>;
  let userRepository: jest.Mocked<IUserRepository>;
  let familyUseCase: FamilyUseCase;

  beforeEach(() => {
    familyRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IFamilyRepository>;

    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    familyUseCase = new FamilyUseCase(familyRepository, userRepository);
  });

  describe("createFamily", () => {
    it("should throw NotFound error if user is not found", async () => {
      const input = {
        userId: 9999,
        name: "Family Name",
        paymentSchedule: 1,
      };

      userRepository.findById.mockResolvedValue(null);

      await expect(familyUseCase.createFamily(input)).rejects.toThrow(
        new AppError("NotFound", "User not found")
      );
    });

    it("should throw Unauthorized error if user is not verified", async () => {
      const input = {
        userId: 1,
        name: "Family Name",
        paymentSchedule: 1,
      };

      const user = createMockUser({ isVerified: false });
      userRepository.findById.mockResolvedValue(user);

      await expect(familyUseCase.createFamily(input)).rejects.toThrow(
        new AppError("Unauthorized", "User is not verified")
      );
    });

    it("should throw ValidationError if user already belongs to a family", async () => {
      const input = {
        userId: 1,
        name: "Family Name",
        paymentSchedule: 1,
      };

      const user = createMockUser({
        isVerified: true,
        familyId: 1
      });
      userRepository.findById.mockResolvedValue(user);

      await expect(familyUseCase.createFamily(input)).rejects.toThrow(
        new AppError("ValidationError", "User already belongs to a family")
      );
    });

    it("should throw the original error if family save fails", async () => {
      const input = {
        userId: 1,
        name: "Family Name",
        paymentSchedule: 1,
      };

      const user = createMockUser({
        isVerified: true,
        familyId: null
      });
      userRepository.findById.mockResolvedValue(user);

      const error = new Error("Save failed");
      familyRepository.save.mockRejectedValue(error);

      await expect(familyUseCase.createFamily(input)).rejects.toThrow(error);
    });

    it("should create a family successfully", async () => {
      const input = {
        userId: 1,
        name: "Family Name",
        paymentSchedule: 1,
      };

      const user = createMockUser({
        isVerified: true,
        familyId: null
      });
      userRepository.findById.mockResolvedValue(user);

      const family = createMockFamily({
        name: input.name,
        payment_schedule: input.paymentSchedule
      });
      familyRepository.save.mockResolvedValue(family);

      const result = await familyUseCase.createFamily(input);

      expect(result).toEqual(family);

      expect(familyRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: family.name,
          payment_schedule: family.payment_schedule
        }),
        user
      );
    });
  });
});
