import { Work } from "@/domain/entities/Work";

export const createMockWork = (override: {
  id?: number;
  status?: "InProgress" | "Completed" | "Approved" | "Rejected";
  taskId?: number;
  userId?: number;
} = {}): Work => {
  const defaultProps = {
    id: 1,
    status: "InProgress" as const,
    taskId: 1,
    userId: 1
  };

  const mergedProps = { ...defaultProps, ...override };

  const work = new Work(
    mergedProps.status,
    mergedProps.taskId,
    mergedProps.userId
  );

  if (mergedProps.id !== undefined) {
    Object.defineProperty(work, 'id', {
      value: mergedProps.id,
      writable: true,
      enumerable: true,
    });
  }

  return work;
};
