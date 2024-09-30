import { Work } from "@/domain/entities/Work";

describe("Work Entity", () => {
  it("should create a Work instance with correct properties", () => {
    const work = new Work("InProgress", 1, 1);

    expect(work.status).toBe("InProgress");
    expect(work.taskId).toBe(1);
    expect(work.userId).toBe(1);
  });
});
