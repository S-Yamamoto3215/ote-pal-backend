import { TaskDetail } from "@/domain/entities/TaskDetail";

describe('TaskDetail Entity', () => {
  let taskDetail: TaskDetail;

  beforeEach(() => {
    taskDetail = new TaskDetail('Test Description', 100, 1, 1);
  });

  it('should create an instance of TaskDetail', () => {
    expect(taskDetail).toBeInstanceOf(TaskDetail);
    expect(taskDetail.getCustomDescription()).toBe('Test Description');
    expect(taskDetail.getCustomReward()).toBe(100);
    expect(taskDetail.getUserId()).toBe(1);
    expect(taskDetail.getTaskId()).toBe(1);
  });

  it('should set and get id', () => {
    taskDetail.setId(1);
    expect(taskDetail.getId()).toBe(1);
  });

  it('should set and get custom description', () => {
    taskDetail.setCustomDescription('Updated Description');
    expect(taskDetail.getCustomDescription()).toBe('Updated Description');
  });

  it('should set and get custom reward', () => {
    taskDetail.setCustomReward(200);
    expect(taskDetail.getCustomReward()).toBe(200);
  });

  it('should set and get user id', () => {
    taskDetail.setUserId(2);
    expect(taskDetail.getUserId()).toBe(2);
  });

  it('should set and get task id', () => {
    taskDetail.setTaskId(2);
    expect(taskDetail.getTaskId()).toBe(2);
  });
});
