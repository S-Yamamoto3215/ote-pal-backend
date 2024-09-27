import { Task } from "@/domain/entities/Task";

describe("Task Entity", () => {
  let task: Task;

  beforeEach(() => {
    task = new Task("Test Task", "This is a test task", 100, 1);
  });

  it("should create a task with the correct properties", () => {
    expect(task.getName()).toBe("Test Task");
    expect(task.getDescription()).toBe("This is a test task");
    expect(task.getReward()).toBe(100);
    expect(task.getFamilyId()).toBe(1);
  });

  it("should set and get the id correctly", () => {
    task.setId(1);
    expect(task.getId()).toBe(1);
  });

  it("should set and get the name correctly", () => {
    task.setName("Updated Task");
    expect(task.getName()).toBe("Updated Task");
  });

  it("should set and get the description correctly", () => {
    task.setDescription("Updated description");
    expect(task.getDescription()).toBe("Updated description");
  });

  it("should set and get the reward correctly", () => {
    task.setReward(200);
    expect(task.getReward()).toBe(200);
  });

  it("should set and get the familyId correctly", () => {
    task.setFamilyId(2);
    expect(task.getFamilyId()).toBe(2);
  });
});
