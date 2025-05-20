import { Work } from "@/domain/entities/Work";

describe("Work Entity", () => {
  const validParams = {
    status: "InProgress" as "InProgress" | "Completed" | "Approved" | "Rejected",
    taskId: 1,
    userId: 1,
  };

  describe("constructor", () => {
    it("should create a Work when valid parameters are provided", () => {
      const { status, taskId, userId } = validParams;

      const work = new Work(status, taskId, userId);

      expect(work.status).toBe(validParams.status);
      expect(work.taskId).toBe(validParams.taskId);
      expect(work.userId).toBe(validParams.userId);
    });
  });

  // describe("validate", () => {
  //   // it("should {$expectedValue} when {$conditions}", () => {});
  //   // it("should throw {$ErrorType} when {$conditions}", () => {});
  // });
});
