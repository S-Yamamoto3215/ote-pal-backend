import { Task } from "@/domain/entities/Task";

describe("Task Entity", () => {
  let task: Task;

  beforeEach(() => {
    task = new Task("Test Task", "This is a test task", 100, 1);
  });

  it("should create a task with the correct properties", () => {
    expect(task.name).toBe("Test Task");
    expect(task.description).toBe("This is a test task");
    expect(task.reward).toBe(100);
    expect(task.familyId).toBe(1);
  });
});
