import { Request, Response, NextFunction } from "express";
import { TaskController } from "@/interface/controllers/TaskController";

// 必要なユースケースインターフェースをインポート
// import { IAuthUseCase } from "@/application/usecases/AuthUseCase";

describe("TaskController", () => {
  // ユースケースのモックを定義
  // let authUseCase: jest.Mocked<IAuthUseCase>;

  let taskController: TaskController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    // ユースケースモックの設定
    // authUseCase = {
    //   login: jest.fn(),
    // };

    // コントローラーが依存しているユースケースモックを渡す
    taskController = new TaskController();

    req = {
      body: {},
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  it("Add Test", async () => {});
});
