import { Work } from "@/domain/entities/Work";

describe("Work Entity", () => {
  const validParams = {
    status: "InProgress" as "InProgress" | "Completed" | "Approved" | "Rejected",
    taskId: 1,
    userId: 1,
  };

  it("should create a Work instance with correct properties", () => {
    const work = new Work(
      validParams.status,
      validParams.taskId,
      validParams.userId
    );

    expect(work.status).toBe(validParams.status);
    expect(work.taskId).toBe(validParams.taskId);
    expect(work.userId).toBe(validParams.userId);
  });
});
