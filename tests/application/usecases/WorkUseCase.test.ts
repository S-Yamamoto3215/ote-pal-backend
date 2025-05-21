import { Work } from "@/domain/entities/Work";
import { CreateWorkInput } from "@/types/WorkTypes";
import { IWorkRepository } from "@/domain/repositories/WorkRepository";
import { WorkUseCase } from "@/application/usecases/WorkUseCase/WorkUseCase";
import { createMockWork } from "@tests/helpers/factories";
import { createMockWorkRepository } from "@tests/helpers/mocks";

describe("WorkUseCase", () => {
  let workRepository: jest.Mocked<IWorkRepository>;
  let workUseCase: WorkUseCase;

  beforeEach(() => {
    workRepository = createMockWorkRepository();
    workUseCase = new WorkUseCase(workRepository);
  });

  describe("createWork", () => {
    const validInput: CreateWorkInput = {
      status: "InProgress",
      taskId: 1,
      userId: 2,
    };

    it("should create and return a new Work when valid input is provided", async () => {
      // Arrange
      const mockWork = createMockWork({
        status: validInput.status,
        taskId: validInput.taskId,
        userId: validInput.userId
      });
      workRepository.save.mockResolvedValue(mockWork);

      // Act
      const result = await workUseCase.createWork(validInput);

      // Assert
      expect(workRepository.save).toHaveBeenCalledWith(expect.objectContaining(validInput));
      expect(result).toEqual(mockWork);
    });

    it("should propagate repository errors when save operation fails", async () => {
      // Arrange
      const mockError = new Error("Database error");
      workRepository.save.mockRejectedValue(mockError);

      // Act & Assert
      await expect(workUseCase.createWork(validInput)).rejects.toThrow(mockError);
      expect(workRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(validInput)
      );
    });
  });

  describe("deleteWork", () => {
    it("should successfully delete the work when valid id is provided", async () => {
      // Arrange
      const workId = 1;

      // Act
      await workUseCase.deleteWork(workId);

      // Assert
      expect(workRepository.delete).toHaveBeenCalledWith(workId);
    });

    it("should propagate repository errors when delete operation fails", async () => {
      // Arrange
      const workId = 10;
      const mockError = new Error("Deletion error");
      workRepository.delete.mockRejectedValue(mockError);

      // Act & Assert
      await expect(workUseCase.deleteWork(workId)).rejects.toThrow(mockError);
      expect(workRepository.delete).toHaveBeenCalledWith(workId);
    });
  });
});
