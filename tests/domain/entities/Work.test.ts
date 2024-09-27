import { Work } from "@/domain/entities/Work";

describe("Work Entity", () => {
  it("should create a Work instance with correct properties", () => {
    const work = new Work("InProgress", 1, 1);

    expect(work.getStatus()).toBe("InProgress");
    expect(work.getTaskId()).toBe(1);
    expect(work.getUserId()).toBe(1);
  });

  it("should set and get id correctly", () => {
    const work = new Work("InProgress", 1, 1);
    work.setId(100);

    expect(work.getId()).toBe(100);
  });

  it("should set and get status correctly", () => {
    const work = new Work("InProgress", 1, 1);
    work.setStatus("Completed");

    expect(work.getStatus()).toBe("Completed");
  });

  it("should set and get taskId correctly", () => {
    const work = new Work("InProgress", 1, 1);
    work.setTaskId(2);

    expect(work.getTaskId()).toBe(2);
  });

  it("should set and get userId correctly", () => {
    const work = new Work("InProgress", 1, 1);
    work.setUserId(2);

    expect(work.getUserId()).toBe(2);
  });
});
