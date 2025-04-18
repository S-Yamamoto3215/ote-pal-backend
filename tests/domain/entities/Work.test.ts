import { Work } from "@/domain/entities/Work";

import { workSeeds } from "@tests/resources/Work/WorkSeeds";

describe("Work Entity", () => {
  it("should create a Work instance with correct properties", () => {
    const { status, taskId, userId } = workSeeds[0];
    const work = new Work(status, taskId, userId);

    expect(work.status).toBe(status);
    expect(work.taskId).toBe(taskId);
    expect(work.userId).toBe(userId);
  });
});
