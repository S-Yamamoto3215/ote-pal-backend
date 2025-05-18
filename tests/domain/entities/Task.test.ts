import { Task } from "@/domain/entities/Task";
import { AppError } from "@/infrastructure/errors/AppError";

import { taskSeeds } from "@tests/resources/Task/TaskSeeds";

describe("Task Entity", () => {
  it("should create a task with the correct properties", () => {
    const { name, description, reward, familyId } = taskSeeds[0];
    const task = new Task(name, description, reward, familyId);

    expect(task.name).toBe(name);
    expect(task.description).toBe(description);
    expect(task.reward).toBe(reward);
    expect(task.familyId).toBe(familyId);
  });

  it("should validate the task properly", () => {
    const { name, description, reward, familyId } = taskSeeds[0];
    const task = new Task(name, description, reward, familyId);

    expect(() => task.validate()).not.toThrow();
  });

  it("should throw validation error for invalid task", () => {
    const taskWithEmptyName = new Task("", "説明", 100, 1);
    expect(() => taskWithEmptyName.validate()).toThrow(AppError);
    expect(() => taskWithEmptyName.validate()).toThrow("Name is required");

    const taskWithEmptyDescription = new Task("タスク名", "", 100, 1);
    expect(() => taskWithEmptyDescription.validate()).toThrow(AppError);
    expect(() => taskWithEmptyDescription.validate()).toThrow("Description is required");

    const taskWithInvalidReward = new Task("タスク名", "説明", 0, 1);
    expect(() => taskWithInvalidReward.validate()).toThrow(AppError);
    expect(() => taskWithInvalidReward.validate()).toThrow("Reward must be greater than 0");
  });

  it("should handle works relationship properly", () => {
    const { name, description, reward, familyId } = taskSeeds[0];
    const task = new Task(name, description, reward, familyId);

    expect(task.works).toBeUndefined();

    const mockWorks = [
      { id: 1, status: "InProgress", taskId: 1, userId: 1 },
      { id: 2, status: "Completed", taskId: 1, userId: 2 }
    ];

    Object.defineProperty(task, 'works', {
      value: mockWorks,
      writable: true
    });

    expect(task.works).toEqual(mockWorks);
    expect(task.works?.length).toBe(2);
  });
});
