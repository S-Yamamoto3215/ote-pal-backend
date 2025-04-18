import { Task } from "@/domain/entities/Task";

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
});
