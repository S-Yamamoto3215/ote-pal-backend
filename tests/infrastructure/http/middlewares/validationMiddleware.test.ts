import { Request, Response } from "express";
import { IsNotEmpty, IsString } from "class-validator";
import { validationMiddleware } from "@/infrastructure/http/middlewares/validationMiddleware";
import { AppError } from "@/infrastructure/errors/AppError";

// テスト用のDTOクラス
class TestDTO {
  @IsNotEmpty({ message: "名前は必須です" })
  @IsString({ message: "名前は文字列である必要があります" })
  name!: string;

  @IsNotEmpty({ message: "メールは必須です" })
  @IsString({ message: "メールは文字列である必要があります" })
  email!: string;
}

describe("validationMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it("有効なリクエストデータの場合は次のミドルウェアを呼び出すこと", async () => {
    mockRequest.body = {
      name: "テストユーザー",
      email: "test@example.com"
    };

    const middleware = validationMiddleware(TestDTO);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it("バリデーションエラーがある場合はエラーを次のミドルウェアに渡すこと", async () => {
    mockRequest.body = {
      name: "", // 空の名前（エラー）
      email: "test@example.com"
    };

    const middleware = validationMiddleware(TestDTO);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction.mock.calls[0][0]).toBeInstanceOf(AppError);
    expect(nextFunction.mock.calls[0][0].errorType).toBe("ValidationError");
    expect(nextFunction.mock.calls[0][0].message).toContain("名前は必須です");
  });

  it("複数のバリデーションエラーがある場合はすべてのエラーメッセージを含めること", async () => {
    mockRequest.body = {
      name: "", // 空の名前（エラー）
      email: "" // 空のメール（エラー）
    };

    const middleware = validationMiddleware(TestDTO);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction.mock.calls[0][0]).toBeInstanceOf(AppError);
    expect(nextFunction.mock.calls[0][0].message).toContain("名前は必須です");
    expect(nextFunction.mock.calls[0][0].message).toContain("メールは必須です");
  });

  it("未知のプロパティが含まれる場合はエラーとすること", async () => {
    mockRequest.body = {
      name: "テストユーザー",
      email: "test@example.com",
      unknown: "未知のプロパティ" // DTOに存在しないプロパティ
    };

    const middleware = validationMiddleware(TestDTO);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction.mock.calls[0][0]).toBeInstanceOf(AppError);
    expect(nextFunction.mock.calls[0][0].errorType).toBe("ValidationError");
  });
});
