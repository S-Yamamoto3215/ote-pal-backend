import { Task } from "@/domain/entities/Task";
import { AppError } from "@/infrastructure/errors/AppError";

describe("Task Entity", () => {
  const validParams = {
    name: "Test Task Title 1",
    description: "Task description 1",
    reward: 100,
    familyId: 1,
  };

  it("should create a task with the correct properties", () => {
    const task = new Task(
      validParams.name,
      validParams.description,
      validParams.reward,
      validParams.familyId
    );

    expect(task.name).toBe(validParams.name);
    expect(task.description).toBe(validParams.description);
    expect(task.reward).toBe(validParams.reward);
    expect(task.familyId).toBe(validParams.familyId);
  });

  it("should validate the task properly", () => {
    const task = new Task(
      validParams.name,
      validParams.description,
      validParams.reward,
      validParams.familyId
    );

    expect(() => task.validate()).not.toThrow();
  });

  it("should throw validation error for invalid task", () => {
    const emptyName = "";
    const taskWithEmptyName = new Task(
      emptyName,
      validParams.description,
      validParams.reward,
      validParams.familyId
    );
    expect(() => taskWithEmptyName.validate()).toThrow(AppError);
    expect(() => taskWithEmptyName.validate()).toThrow("Name is required");

    const emptyDescription = "";
    const taskWithEmptyDescription = new Task(
      validParams.name,
      emptyDescription,
      validParams.reward,
      validParams.familyId
    );
    expect(() => taskWithEmptyDescription.validate()).toThrow(AppError);
    expect(() => taskWithEmptyDescription.validate()).toThrow("Description is required");

    const emptyReward = 0;
    const taskWithInvalidReward = new Task(
      validParams.name,
      validParams.description,
      emptyReward,
      validParams.familyId
    );
    expect(() => taskWithInvalidReward.validate()).toThrow(AppError);
    expect(() => taskWithInvalidReward.validate()).toThrow("Reward must be greater than 0");
  });

  it("should handle works relationship properly", () => {
    const mockWorks = [
      { id: 1, status: "InProgress", taskId: 1, userId: 1 },
      { id: 2, status: "Completed", taskId: 1, userId: 2 },
    ];

    const task = new Task(
      validParams.name,
      validParams.description,
      validParams.reward,
      validParams.familyId
    );

    expect(task.works).toBeUndefined();

    Object.defineProperty(task, 'works', {
      value: mockWorks,
      writable: true
    });

    expect(task.works).toEqual(mockWorks);
    expect(task.works?.length).toBe(2);
  });
});
