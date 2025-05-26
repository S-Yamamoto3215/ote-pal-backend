import { TaskUseCase } from "@/application/usecases/TaskUseCase";
import { TaskRepositoryFactory } from "@/application/factories/Task/TaskRepositoryFactory";
import { UserRepositoryFactory } from "@/application/factories/User/UserRepositoryFactory";

export class TaskUseCaseFactory {
  static create(): TaskUseCase {
    const taskRepository = TaskRepositoryFactory.create();
    const userRepository = UserRepositoryFactory.create();
    return new TaskUseCase(taskRepository, userRepository);
  }
}
