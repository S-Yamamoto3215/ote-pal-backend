import { Task } from "@/domain/entities/Task";

export const sampleTask = new Task(
  "サンプルタスク1",
  "これはサンプルタスク1の説明です。",
  1000,
  1,
);

export const sampleTask2: Task = Object.assign(
  new Task(
    "サンプルタスク2",
    "これはサンプルタスク2の説明です。",
    2000,
    1,
  ),
  { id: 2 }
);
