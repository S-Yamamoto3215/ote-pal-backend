import { Family } from "@/domain/entities/Family";
import { IFamilyRepository } from "@/domain/repositories/FamilyRepository";
import { IUserRepository } from "@/domain/repositories/UserRepository";
import { FamilyUseCase } from "@/application/usecases/FamilyUseCase/FamilyUseCase";
import { AppError } from "@/infrastructure/errors/AppError";
import { createMockFamily, createMockUser } from "@tests/helpers/factories";
import { createMockFamilyRepository, createMockUserRepository } from "@tests/helpers/mocks";

describe("FamilyUseCase", () => {
  let familyRepository: jest.Mocked<IFamilyRepository>;
  let userRepository: jest.Mocked<IUserRepository>;
  let familyUseCase: FamilyUseCase;

  beforeEach(() => {
    familyRepository = createMockFamilyRepository();
    userRepository = createMockUserRepository();
    familyUseCase = new FamilyUseCase(familyRepository, userRepository);
  });

  describe("createFamily", () => {
    const validInput = {
      userId: 1,
      name: "Family Name",
      paymentSchedule: 1,
    };

    it("should throw AppError with 'User not found' message when user does not exist", async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(familyUseCase.createFamily({...validInput, userId: 9999})).rejects.toThrow(
        new AppError("NotFound", "User not found")
      );
      expect(userRepository.findById).toHaveBeenCalledWith(9999);
    });

    it("should throw AppError with 'User is not verified' message when user is not verified", async () => {
      // Arrange
      const user = createMockUser({ isVerified: false });
      userRepository.findById.mockResolvedValue(user);

      // Act & Assert
      await expect(familyUseCase.createFamily(validInput)).rejects.toThrow(
        new AppError("Unauthorized", "User is not verified")
      );
      expect(userRepository.findById).toHaveBeenCalledWith(validInput.userId);
    });

    it("should throw AppError with 'User already belongs to a family' message when user already has a family", async () => {
      // Arrange
      const user = createMockUser({
        isVerified: true,
        familyId: 1
      });
      userRepository.findById.mockResolvedValue(user);

      // Act & Assert
      await expect(familyUseCase.createFamily(validInput)).rejects.toThrow(
        new AppError("ValidationError", "User already belongs to a family")
      );
      expect(userRepository.findById).toHaveBeenCalledWith(validInput.userId);
    });

    it("should propagate original error when family repository save operation fails", async () => {
      // Arrange
      const user = createMockUser({
        isVerified: true,
        familyId: null
      });
      userRepository.findById.mockResolvedValue(user);

      const error = new Error("Save failed");
      familyRepository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(familyUseCase.createFamily(validInput)).rejects.toThrow(error);
      expect(userRepository.findById).toHaveBeenCalledWith(validInput.userId);
      expect(familyRepository.save).toHaveBeenCalled();
    });

    it("should successfully create and return a family when valid input is provided", async () => {
      // Arrange
      const user = createMockUser({
        isVerified: true,
        familyId: null
      });
      userRepository.findById.mockResolvedValue(user);

      const family = createMockFamily({
        name: validInput.name,
        payment_schedule: validInput.paymentSchedule
      });
      familyRepository.save.mockResolvedValue(family);

      // Act
      const result = await familyUseCase.createFamily(validInput);

      // Assert
      expect(result).toEqual(family);
      expect(userRepository.findById).toHaveBeenCalledWith(validInput.userId);
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
