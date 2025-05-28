import { Request, Response, NextFunction } from "express";
import { RoleMiddlewareAdapter } from "@/infrastructure/http/middlewares/roleMiddleware";
import { RoleChecker } from "@/domain/permissions/role/RoleChecker";
import { AppError } from "@/infrastructure/errors/AppError";
import { UserRole } from "@/domain/permissions/role/types";

// RoleCheckerのモック
jest.mock("@/domain/permissions/role/RoleChecker");

describe("roleMiddleware", () => {
  const MockedRoleChecker = RoleChecker as jest.MockedClass<typeof RoleChecker>;
  let roleMiddleware: RoleMiddlewareAdapter;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();

    // RoleCheckerのモックインスタンスを設定
    MockedRoleChecker.prototype.hasAnyRole = jest.fn();
    MockedRoleChecker.prototype.customRoleCheck = jest.fn();

    roleMiddleware = new RoleMiddlewareAdapter();

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
  });

  describe("hasRole", () => {
    it("認証されていない場合、Unauthorizedエラーを次のミドルウェアに渡すこと", () => {
      // ユーザー情報なし
      mockRequest.user = undefined;

      const middleware = roleMiddleware.hasRole(["Parent"]);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      expect(nextFunction.mock.calls[0][0].errorType).toBe("Unauthorized");
    });

    it("必要なロールを持つ場合、次のミドルウェアを呼び出すこと", () => {
      // 権限チェック成功
      (MockedRoleChecker.prototype.hasAnyRole as jest.Mock).mockReturnValue({ success: true });

      const middleware = roleMiddleware.hasRole(["Parent"]);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(MockedRoleChecker.prototype.hasAnyRole).toHaveBeenCalledWith("Parent", ["Parent"]);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("必要なロールを持たない場合、Forbiddenエラーを次のミドルウェアに渡すこと", () => {
      // 権限チェック失敗
      (MockedRoleChecker.prototype.hasAnyRole as jest.Mock).mockReturnValue({
        success: false,
        errorMessage: "親ユーザー権限が必要です"
      });

      mockRequest.user = { id: 1, email: "child@example.com", role: "Child" };

      const middleware = roleMiddleware.hasRole(["Parent"]);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(MockedRoleChecker.prototype.hasAnyRole).toHaveBeenCalledWith("Child", ["Parent"]);
      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      expect(nextFunction.mock.calls[0][0].errorType).toBe("Forbidden");
      expect(nextFunction.mock.calls[0][0].message).toBe("親ユーザー権限が必要です");
    });

    it("未知のエラーが発生した場合、Forbiddenエラーに変換して次のミドルウェアに渡すこと", () => {
      // 未知のエラーをスロー
      (MockedRoleChecker.prototype.hasAnyRole as jest.Mock).mockImplementation(() => {
        throw new Error("Unknown error");
      });

      const middleware = roleMiddleware.hasRole(["Parent"]);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      expect(nextFunction.mock.calls[0][0].errorType).toBe("Forbidden");
      expect(nextFunction.mock.calls[0][0].message).toBe("Unknown error");
    });
  });

  describe("customRoleCheck", () => {
    it("認証されていない場合、Unauthorizedエラーを次のミドルウェアに渡すこと", () => {
      // ユーザー情報なし
      mockRequest.user = undefined;

      const checkFn = (role: UserRole) => role === "Parent";
      const middleware = roleMiddleware.customRoleCheck(checkFn);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      expect(nextFunction.mock.calls[0][0].errorType).toBe("Unauthorized");
    });

    it("カスタムチェックに合格した場合、次のミドルウェアを呼び出すこと", () => {
      // カスタムチェック成功
      (MockedRoleChecker.prototype.customRoleCheck as jest.Mock).mockReturnValue({ success: true });

      const checkFn = (role: UserRole) => role === "Parent";
      const middleware = roleMiddleware.customRoleCheck(checkFn);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(MockedRoleChecker.prototype.customRoleCheck).toHaveBeenCalledWith("Parent", checkFn);
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it("カスタムチェックに失敗した場合、Forbiddenエラーを次のミドルウェアに渡すこと", () => {
      // カスタムチェック失敗
      (MockedRoleChecker.prototype.customRoleCheck as jest.Mock).mockReturnValue({
        success: false,
        errorMessage: "必要な権限がありません"
      });

      const checkFn = (role: UserRole) => role !== "Parent" && role !== "Child";
      const middleware = roleMiddleware.customRoleCheck(checkFn);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      expect(nextFunction.mock.calls[0][0].errorType).toBe("Forbidden");
      expect(nextFunction.mock.calls[0][0].message).toBe("必要な権限がありません");
    });
  });
});
