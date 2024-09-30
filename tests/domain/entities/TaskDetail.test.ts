import { TaskDetail } from "@/domain/entities/TaskDetail";

describe('TaskDetail Entity', () => {
  it('should create an instance of TaskDetail', () => {
    const taskDetail = new TaskDetail("Test Description", 100, 1, 1);

    expect(taskDetail.custom_description).toBe('Test Description');
    expect(taskDetail.custom_reward).toBe(100);
    expect(taskDetail.userId).toBe(1);
    expect(taskDetail.taskId).toBe(1);
  });
});
