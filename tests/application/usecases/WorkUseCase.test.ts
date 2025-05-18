import { Work } from "@/domain/entities/Work";
import { CreateWorkInput } from "@/types/WorkTypes";
import { IWorkRepository } from "@/domain/repositories/WorkRepository";
import { WorkUseCase } from "@/application/usecases/WorkUseCase/WorkUseCase";
import { createMockWork } from "@tests/helpers/factories";

describe("WorkUseCase", () => {
  let workRepository: jest.Mocked<IWorkRepository>;
  let workUseCase: WorkUseCase;

  beforeEach(() => {
    workRepository = {
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IWorkRepository>;

    workUseCase = new WorkUseCase(workRepository);
  });

  describe("createWork", () => {
    it("should create a new Work", async () => {
      const input: CreateWorkInput = {
        status: "InProgress",
        taskId: 1,
        userId: 2,
      };

      const mockWork = createMockWork({
        status: input.status,
        taskId: input.taskId,
        userId: input.userId
      });
      workRepository.save.mockResolvedValue(mockWork);

      const result = await workUseCase.createWork(input);

      expect(workRepository.save).toHaveBeenCalledWith(expect.objectContaining(input));
      expect(result).toEqual(mockWork);
    });

    it("should throw an error if the repository encounters an error", async () => {
      const input: CreateWorkInput = {
        status: "InProgress",
        taskId: 1,
        userId: 2,
      };

      const mockError = new Error("Database error");
      workRepository.save.mockRejectedValue(mockError);

      await expect(workUseCase.createWork(input)).rejects.toThrow(mockError);
      expect(workRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(input)
      );
    });
  });

  describe("deleteWork", () => {
    it("should delete the Work with the specified ID", async () => {
      const workId = 1;
      await workUseCase.deleteWork(workId);

      expect(workRepository.delete).toHaveBeenCalledWith(workId);
    });

    it("should throw an error if the repository encounters an error during deletion", async () => {
      const workId = 10;
      const mockError = new Error("Deletion error");
      workRepository.delete.mockRejectedValue(mockError);

      await expect(workUseCase.deleteWork(workId)).rejects.toThrow(mockError);
      expect(workRepository.delete).toHaveBeenCalledWith(workId);
    });
  });
});
