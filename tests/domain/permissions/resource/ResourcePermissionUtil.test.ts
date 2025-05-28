import { ResourcePermissionUtil } from "@/domain/permissions/resource/ResourcePermissionUtil";
import { ResourcePermissionChecker } from "@/domain/permissions/resource/ResourcePermissionChecker";
import { ResourcePermissionContext } from "@/domain/permissions/resource/types";
import { AppError } from "@/infrastructure/errors/AppError";

// ResourcePermissionCheckerのモック
jest.mock("@/domain/permissions/resource/ResourcePermissionChecker", () => {
  return {
    ResourcePermissionChecker: jest.fn().mockImplementation(() => {
      return {
        checkPermission: jest.fn(),
        isResourceOwner: jest.fn(),
        isOperationAllowedForRole: jest.fn(),
        registerRepository: jest.fn()
      };
    })
  };
});

describe("ResourcePermissionUtil", () => {
  let mockChecker: any;

  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();

    // モックインスタンスを作成
    mockChecker = new ResourcePermissionChecker();

    // ResourcePermissionUtilに初期化
    ResourcePermissionUtil.initialize(mockChecker);
  });

  describe("requirePermission", () => {
    it("権限チェックが成功する場合、例外をスローしないこと", async () => {
      const context: ResourcePermissionContext = {
        resourceType: "task",
        operation: "read",
        userRole: "Parent"
      };

      // モックの戻り値を設定
      mockChecker.checkPermission.mockResolvedValue({ success: true });

      // テスト実行
      await expect(ResourcePermissionUtil.requirePermission(context)).resolves.not.toThrow();
      expect(mockChecker.checkPermission).toHaveBeenCalledWith(context);
    });

    it("権限チェックが失敗する場合、AppErrorをスローすること", async () => {
      const context: ResourcePermissionContext = {
        resourceType: "task",
        operation: "delete",
        userRole: "Child"
      };

      // モックの戻り値を設定
      mockChecker.checkPermission.mockResolvedValue({
        success: false,
        errorCode: "PERMISSION_DENIED",
        errorMessage: "権限がありません",
        statusCode: 403
      });

      // テスト実行
      await expect(ResourcePermissionUtil.requirePermission(context)).rejects.toThrow(AppError);
      await expect(ResourcePermissionUtil.requirePermission(context)).rejects.toMatchObject({
        errorType: "Forbidden",
        message: "権限がありません"
      });
    });
  });

  describe("requireResourceOwnership", () => {
    it("リソースの所有者である場合、例外をスローしないこと", async () => {
      // モックの戻り値を設定
      mockChecker.isResourceOwner.mockResolvedValue(true);

      // テスト実行
      await expect(
        ResourcePermissionUtil.requireResourceOwnership("1", "1", "task")
      ).resolves.not.toThrow();

      expect(mockChecker.isResourceOwner).toHaveBeenCalledWith({
        userId: "1",
        resourceId: "1",
        resourceType: "task"
      });
    });

    it("リソースの所有者でない場合、AppErrorをスローすること", async () => {
      // モックの戻り値を設定
      mockChecker.isResourceOwner.mockResolvedValue(false);

      // テスト実行
      await expect(
        ResourcePermissionUtil.requireResourceOwnership("1", "2", "task")
      ).rejects.toThrow(AppError);

      await expect(
        ResourcePermissionUtil.requireResourceOwnership("1", "2", "task")
      ).rejects.toMatchObject({
        errorType: "Forbidden",
        message: "このリソースを操作する権限がありません"
      });
    });
  });
});
