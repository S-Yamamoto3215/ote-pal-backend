import { Task } from "@/domain/entities/Task";
import { AppError } from "@/infrastructure/errors/AppError";

describe("Task Entity", () => {
  const validParams = {
    name: "Test Task Title 1",
    description: "Task description 1",
    reward: 100,
    familyId: 1,
  };

  describe("constructor", () => {
    it("should create a task when valid parameters are provided", () => {
      const { name, description, reward, familyId } = validParams;

      const task = new Task(name, description, reward, familyId);

      expect(task.name).toBe(name);
      expect(task.description).toBe(description);
      expect(task.reward).toBe(reward);
      expect(task.familyId).toBe(familyId);
    });
  });

  describe("validate", () => {
    it("should not throw any errors when values are valid", () => {
      const { name, description, reward, familyId } = validParams;

      const task = new Task(name, description, reward, familyId);

      expect(() => task.validate()).not.toThrow();
    });

    it("should throw AppError when name is empty", () => {
      const { description, reward, familyId } = validParams;
      const emptyName = "";

      const taskWithEmptyName = new Task(emptyName, description, reward, familyId);

      expect(() => taskWithEmptyName.validate()).toThrow(AppError);
      expect(() => taskWithEmptyName.validate()).toThrow("Name is required");
    });

    it("should throw AppError when description is empty", () => {
      const { name, reward, familyId } = validParams;
      const emptyDescription = "";

      const taskWithEmptyDescription = new Task(name, emptyDescription, reward, familyId);

      expect(() => taskWithEmptyDescription.validate()).toThrow(AppError);
      expect(() => taskWithEmptyDescription.validate()).toThrow(
        "Description is required"
      );
    });

    it("should throw AppError when reward is zero", () => {
      const { name, description, familyId } = validParams;
      const emptyReward = 0;

      const taskWithInvalidReward = new Task(name, description, emptyReward, familyId);

      expect(() => taskWithInvalidReward.validate()).toThrow(AppError);
      expect(() => taskWithInvalidReward.validate()).toThrow(
        "Reward must be greater than 0"
      );
    });
  });
});
