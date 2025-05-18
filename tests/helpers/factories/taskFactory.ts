import { Task } from "@/domain/entities/Task";

export const createMockTask = (override: {
  id?: number;
  name?: string;
  description?: string;
  reward?: number;
  familyId?: number;
} = {}): Task => {
  const defaultProps = {
    id: 1,
    name: "テストタスク",
    description: "テストタスクの説明です",
    reward: 100,
    familyId: 1
  };

  const mergedProps = { ...defaultProps, ...override };

  const task = new Task(
    mergedProps.name,
    mergedProps.description,
    mergedProps.reward,
    mergedProps.familyId
  );

  if (mergedProps.id !== undefined) {
    Object.defineProperty(task, 'id', {
      value: mergedProps.id,
      writable: true,
      enumerable: true,
    });
  }

  return task;
};
