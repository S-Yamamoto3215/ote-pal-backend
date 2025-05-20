import { TaskDetail } from "@/domain/entities/TaskDetail";

describe('TaskDetail Entity', () => {
  const validParams = {
    custom_description: "Test Description",
    custom_reward: 100,
    userId: 1,
    taskId: 1,
  };

  describe("constructor", () => {
    it("should create a TaskDetail when valid parameters are provided", () => {
      const { custom_description, custom_reward, userId, taskId } = validParams;

      const taskDetail = new TaskDetail(custom_description, custom_reward, userId, taskId);

      expect(taskDetail.custom_description).toBe(custom_description);
      expect(taskDetail.custom_reward).toBe(custom_reward);
      expect(taskDetail.userId).toBe(userId);
      expect(taskDetail.taskId).toBe(taskId);
    });
  });

  // describe("validate", () => {
    // it("should {$expectedValue} when {$conditions}", () => {});
    // it("should throw {$ErrorType} when {$conditions}", () => {});
  // });
});
