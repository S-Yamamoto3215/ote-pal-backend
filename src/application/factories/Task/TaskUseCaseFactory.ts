import { TaskUseCase } from "@/application/usecases/TaskUseCase";
import { TaskRepositoryFactory } from "@/application/factories/Task/TaskRepositoryFactory";

export class TaskUseCaseFactory {
  static create(): TaskUseCase {
    const taskRepository = TaskRepositoryFactory.create();
    return new TaskUseCase(taskRepository);
  }
}
