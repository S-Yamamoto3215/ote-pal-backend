import { TaskController } from "@/interface/controllers/TaskController";
import { TaskUseCaseFactory } from "@/application/factories/Task/TaskUseCaseFactory";

export class TaskControllerFactory {
  static create(): TaskController {
    const taskUseCase = TaskUseCaseFactory.create();
    return new TaskController(taskUseCase);
  }
}
