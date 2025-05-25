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

  describe("getFamilyDetailById", () => {
    const familyId = 1;
    const requestUserId = 1;

    it("ユーザーが見つからない場合、'User not found'メッセージのAppErrorをスローすること", async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(familyUseCase.getFamilyDetailById(familyId, requestUserId)).rejects.toThrow(
        new AppError("NotFound", "User not found")
      );
      expect(userRepository.findById).toHaveBeenCalledWith(requestUserId);
    });

    it("ユーザーが指定された家族に属していない場合、'User does not belong to this family'メッセージのAppErrorをスローすること", async () => {
      // Arrange
      const user = createMockUser({
        id: requestUserId,
        familyId: 2 // 別の家族ID
      });
      userRepository.findById.mockResolvedValue(user);

      // Act & Assert
      await expect(familyUseCase.getFamilyDetailById(familyId, requestUserId)).rejects.toThrow(
        new AppError("Forbidden", "User does not belong to this family")
      );
      expect(userRepository.findById).toHaveBeenCalledWith(requestUserId);
    });

    it("家族が見つからない場合、'Family not found'メッセージのAppErrorをスローすること", async () => {
      // Arrange
      const user = createMockUser({
        id: requestUserId,
        familyId: familyId
      });
      userRepository.findById.mockResolvedValue(user);
      familyRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(familyUseCase.getFamilyDetailById(familyId, requestUserId)).rejects.toThrow(
        new AppError("NotFound", "Family not found")
      );
      expect(userRepository.findById).toHaveBeenCalledWith(requestUserId);
      expect(familyRepository.findById).toHaveBeenCalledWith(familyId);
    });

    it("ユーザーリスト取得時にエラーが発生した場合、そのエラーをそのまま伝搬すること", async () => {
      // Arrange
      const user = createMockUser({
        id: requestUserId,
        familyId: familyId
      });
      const family = createMockFamily({
        id: familyId,
        name: "Test Family",
        payment_schedule: 15
      });

      userRepository.findById.mockResolvedValue(user);
      familyRepository.findById.mockResolvedValue(family);

      // findByFamilyIdでエラーが発生するケース
      const error = new AppError("DatabaseError", "Database error");
      userRepository.findByFamilyId.mockRejectedValue(error);

      // Act & Assert
      await expect(familyUseCase.getFamilyDetailById(familyId, requestUserId)).rejects.toThrow(error);
      expect(userRepository.findById).toHaveBeenCalledWith(requestUserId);
      expect(familyRepository.findById).toHaveBeenCalledWith(familyId);
      expect(userRepository.findByFamilyId).toHaveBeenCalledWith(familyId);
    });

    it("すべての条件を満たす場合、正しい家族詳細情報を返すこと", async () => {
      // Arrange
      const user1 = createMockUser({
        id: 1,
        name: "Parent User",
        role: "Parent",
        familyId: familyId
      });
      const user2 = createMockUser({
        id: 2,
        name: "Child User",
        role: "Child",
        familyId: familyId
      });
      const family = createMockFamily({
        id: familyId,
        name: "Test Family",
        payment_schedule: 15
      });

      userRepository.findById.mockResolvedValue(user1);
      familyRepository.findById.mockResolvedValue(family);
      userRepository.findByFamilyId.mockResolvedValue([user1, user2]);

      // Act
      const result = await familyUseCase.getFamilyDetailById(familyId, requestUserId);

      // Assert
      expect(result).toEqual({
        name: family.name,
        paymentSchedule: family.payment_schedule,
        users: [
          { userId: 1, userName: "Parent User" },
          { userId: 2, userName: "Child User" }
        ]
      });
      expect(userRepository.findById).toHaveBeenCalledWith(requestUserId);
      expect(familyRepository.findById).toHaveBeenCalledWith(familyId);
      expect(userRepository.findByFamilyId).toHaveBeenCalledWith(familyId);
    });

    it("ユーザーリストが空の場合でも、正しい形式の空リストを含むレスポンスを返すこと", async () => {
      // Arrange
      const user = createMockUser({
        id: requestUserId,
        familyId: familyId
      });
      const family = createMockFamily({
        id: familyId,
        name: "Empty Family",
        payment_schedule: 10
      });

      userRepository.findById.mockResolvedValue(user);
      familyRepository.findById.mockResolvedValue(family);
      userRepository.findByFamilyId.mockResolvedValue([]); // 空のユーザーリスト

      // Act
      const result = await familyUseCase.getFamilyDetailById(familyId, requestUserId);

      // Assert
      expect(result).toEqual({
        name: family.name,
        paymentSchedule: family.payment_schedule,
        users: [] // 空の配列
      });
      expect(userRepository.findById).toHaveBeenCalledWith(requestUserId);
      expect(familyRepository.findById).toHaveBeenCalledWith(familyId);
      expect(userRepository.findByFamilyId).toHaveBeenCalledWith(familyId);
    });
  });
});
