import { TaskDetail } from "@/domain/entities/TaskDetail";

describe('TaskDetail Entity', () => {
  const validParams = {
    custom_description: "Test Description",
    custom_reward: 100,
    userId: 1,
    taskId: 1,
  };

  it('should create an instance of TaskDetail', () => {
    const taskDetail = new TaskDetail(
      validParams.custom_description,
      validParams.custom_reward,
      validParams.userId,
      validParams.taskId
    );

    expect(taskDetail.custom_description).toBe(validParams.custom_description);
    expect(taskDetail.custom_reward).toBe(validParams.custom_reward);
    expect(taskDetail.userId).toBe(validParams.userId);
    expect(taskDetail.taskId).toBe(validParams.taskId);
  });
});
