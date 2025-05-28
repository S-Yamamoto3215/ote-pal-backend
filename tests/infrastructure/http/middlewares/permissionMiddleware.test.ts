import { Request, Response, NextFunction } from "express";
import { checkResourcePermission } from "@/infrastructure/http/middlewares/permissionMiddleware";
import { ResourcePermissionUtil } from "@/domain/permissions/resource/ResourcePermissionUtil";
import { AppError } from "@/infrastructure/errors/AppError";

// ResourcePermissionUtilのモック
jest.mock("@/domain/permissions/resource/ResourcePermissionUtil");

describe("permissionMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();

    // リクエスト、レスポンス、nextのモックを設定
    mockRequest = {
      user: {
        id: 1,
        email: "test@example.com",
        role: "Parent"
      }
    };
    mockResponse = {};
    nextFunction = jest.fn();

    // ResourcePermissionUtilのモックメソッドを設定
    jest.spyOn(ResourcePermissionUtil, "canAccess").mockImplementation(() => true);
  });

  it("認証されていない場合、Unauthorizedエラーを次のミドルウェアに渡すこと", () => {
    // ユーザー情報なし
    mockRequest.user = undefined;

    const middleware = checkResourcePermission("task", "read");
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    expect(nextFunction.mock.calls[0][0].errorType).toBe("Unauthorized");
  });

  it("権限がある場合、次のミドルウェアを呼び出すこと", () => {
    // 権限あり
    (ResourcePermissionUtil.canAccess as jest.Mock).mockReturnValue(true);

    const middleware = checkResourcePermission("task", "read");
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(ResourcePermissionUtil.canAccess).toHaveBeenCalledWith("task", "read", "Parent");
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it("権限がない場合、Forbiddenエラーを次のミドルウェアに渡すこと", () => {
    // 権限なし
    (ResourcePermissionUtil.canAccess as jest.Mock).mockReturnValue(false);

    const middleware = checkResourcePermission("task", "delete");
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(ResourcePermissionUtil.canAccess).toHaveBeenCalledWith("task", "delete", "Parent");
    expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    expect(nextFunction.mock.calls[0][0].errorType).toBe("Forbidden");
  });

  it("未知のエラーが発生した場合、Forbiddenエラーに変換して次のミドルウェアに渡すこと", () => {
    // 未知のエラーをスロー
    (ResourcePermissionUtil.canAccess as jest.Mock).mockImplementation(() => {
      throw new Error("Unknown error");
    });

    const middleware = checkResourcePermission("task", "read");
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    expect(nextFunction.mock.calls[0][0].errorType).toBe("Forbidden");
    expect(nextFunction.mock.calls[0][0].message).toBe("Unknown error");
  });

  it("AppErrorがスローされた場合、そのままのエラーを次のミドルウェアに渡すこと", () => {
    // AppErrorをスロー
    const appError = new AppError("Custom", "Custom error");
    (ResourcePermissionUtil.canAccess as jest.Mock).mockImplementation(() => {
      throw appError;
    });

    const middleware = checkResourcePermission("task", "read");
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(appError);
  });
});
