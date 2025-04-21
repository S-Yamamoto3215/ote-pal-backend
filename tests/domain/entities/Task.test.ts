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

    // 有効なタスクは検証に合格する
    expect(() => task.validate()).not.toThrow();
  });

  it("should throw validation error for invalid task", () => {
    // 名前が空のタスク
    const taskWithEmptyName = new Task("", "説明", 100, 1);
    expect(() => taskWithEmptyName.validate()).toThrow(AppError);
    expect(() => taskWithEmptyName.validate()).toThrow("Name is required");

    // 説明が空のタスク
    const taskWithEmptyDescription = new Task("タスク名", "", 100, 1);
    expect(() => taskWithEmptyDescription.validate()).toThrow(AppError);
    expect(() => taskWithEmptyDescription.validate()).toThrow("Description is required");

    // 報酬が0以下のタスク
    const taskWithInvalidReward = new Task("タスク名", "説明", 0, 1);
    expect(() => taskWithInvalidReward.validate()).toThrow(AppError);
    expect(() => taskWithInvalidReward.validate()).toThrow("Reward must be greater than 0");
  });

  it("should handle works relationship properly", () => {
    const { name, description, reward, familyId } = taskSeeds[0];
    const task = new Task(name, description, reward, familyId);

    // worksプロパティは初期状態では未定義
    expect(task.works).toBeUndefined();

    // works配列を設定
    const mockWorks = [
      { id: 1, status: "InProgress", taskId: 1, userId: 1 },
      { id: 2, status: "Completed", taskId: 1, userId: 2 }
    ];

    // プライベートプロパティとしてworksを設定
    Object.defineProperty(task, 'works', {
      value: mockWorks,
      writable: true
    });

    // worksが正しく設定されているか確認
    expect(task.works).toEqual(mockWorks);
    expect(task.works?.length).toBe(2);
  });
});
