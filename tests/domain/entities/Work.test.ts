import { Work } from "@/domain/entities/Work";

import { workSeeds } from "@tests/resources/Work/WorkSeeds";

describe("Work Entity", () => {
  it("should create a Work instance with correct properties", () => {
    const { status, taskId, userId } = workSeeds[0];
    const work = new Work(status, taskId, userId);

    expect(work.status).toBe("InProgress");
    expect(work.taskId).toBe(1);
    expect(work.userId).toBe(1);
  });
});
