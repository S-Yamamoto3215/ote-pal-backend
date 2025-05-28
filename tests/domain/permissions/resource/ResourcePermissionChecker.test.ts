import { ResourcePermissionChecker } from "@/domain/permissions/resource/ResourcePermissionChecker";
import { ResourceType, OperationType, ResourcePermissionContext } from "@/domain/permissions/resource/types";

describe("ResourcePermissionChecker", () => {
  let resourcePermissionChecker: ResourcePermissionChecker;

  // モックリポジトリ
  const mockTaskRepository = {
    findById: jest.fn(),
  };

  const mockUserRepository = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    // リポジトリのモックをリセット
    jest.clearAllMocks();

    // モックリポジトリを使用してチェッカーを初期化
    resourcePermissionChecker = new ResourcePermissionChecker({
      task: mockTaskRepository,
      user: mockUserRepository
    });

    // リソース所有者チェックのモック
    mockTaskRepository.findById.mockImplementation((id) => {
      if (id === "1") {
        return Promise.resolve({ id: "1", userId: "1" });
      } else if (id === "2") {
        return Promise.resolve({ id: "2", userId: "2" });
      }
      return Promise.resolve(null);
    });
  });

  describe("isOperationAllowedForRole", () => {
    it("許可された操作とロールの組み合わせの場合、trueを返すこと", () => {
      const result = resourcePermissionChecker.isOperationAllowedForRole("task", "create", "Parent");
      expect(result).toBeTruthy();
    });

    it("許可されていない操作とロールの組み合わせの場合、falseを返すこと", () => {
      const result = resourcePermissionChecker.isOperationAllowedForRole("task", "create", "Child");
      expect(result).toBeFalsy();
    });
  });

  describe("requiresOwnershipCheck", () => {
    it("所有者チェックが必要な操作の場合、trueを返すこと", () => {
      const result = resourcePermissionChecker.requiresOwnershipCheck("task", "update");
      expect(result).toBeTruthy();
    });

    it("所有者チェックが不要な操作の場合、falseを返すこと", () => {
      const result = resourcePermissionChecker.requiresOwnershipCheck("family", "read");
      expect(result).toBeFalsy();
    });
  });

  describe("isResourceOwner", () => {
    it("リソース所有者の場合、trueを返すこと", async () => {
      const result = await resourcePermissionChecker.isResourceOwner({
        userId: "1",
        resourceId: "1",
        resourceType: "task"
      });
      expect(result).toBeTruthy();
    });

    it("リソース所有者でない場合、falseを返すこと", async () => {
      const result = await resourcePermissionChecker.isResourceOwner({
        userId: "1",
        resourceId: "2",
        resourceType: "task"
      });
      expect(result).toBeFalsy();
    });

    it("リポジトリが登録されていない場合、エラーをスローすること", async () => {
      await expect(
        resourcePermissionChecker.isResourceOwner({
          userId: "1",
          resourceId: "1",
          resourceType: "nonExisting" as ResourceType
        })
      ).rejects.toThrow("リポジトリが登録されていません");
    });
  });

  describe("executeCustomCheck", () => {
    it("カスタムチェックがtrueを返す場合、trueを返すこと", () => {
      const context: ResourcePermissionContext = {
        resourceType: "task",
        operation: "update",
        userRole: "Parent",
        userId: "1",
        resourceId: "1",
      };

      const customCheckFn = jest.fn().mockReturnValue(true);

      const result = resourcePermissionChecker.executeCustomCheck(context, customCheckFn);
      expect(result).toBeTruthy();
      expect(customCheckFn).toHaveBeenCalledWith(context);
    });

    it("カスタムチェックがfalseを返す場合、falseを返すこと", () => {
      const context: ResourcePermissionContext = {
        resourceType: "task",
        operation: "update",
        userRole: "Parent",
        userId: "1",
        resourceId: "1",
      };

      const customCheckFn = jest.fn().mockReturnValue(false);

      const result = resourcePermissionChecker.executeCustomCheck(context, customCheckFn);
      expect(result).toBeFalsy();
      expect(customCheckFn).toHaveBeenCalledWith(context);
    });
  });

  describe("checkPermission", () => {
    it("すべての権限チェックをパスする場合、成功結果を返すこと", async () => {
      const context: ResourcePermissionContext = {
        resourceType: "task",
        operation: "read",
        userRole: "Parent",
      };

      const result = await resourcePermissionChecker.checkPermission(context);
      expect(result.success).toBeTruthy();
    });

    it("ロールベースのチェックに失敗する場合、失敗結果を返すこと", async () => {
      const context: ResourcePermissionContext = {
        resourceType: "task",
        operation: "delete",
        userRole: "Child",
      };

      const result = await resourcePermissionChecker.checkPermission(context);
      expect(result.success).toBeFalsy();
      expect(result.errorCode).toBe("PERMISSION_DENIED");
    });

    it("所有権チェックに失敗する場合、失敗結果を返すこと", async () => {
      const context: ResourcePermissionContext = {
        resourceType: "task",
        operation: "update",
        userRole: "Parent",
        userId: "1",
        resourceId: "2", // 所有者は別のユーザー
      };

      const result = await resourcePermissionChecker.checkPermission(context);
      expect(result.success).toBeFalsy();
      expect(result.errorCode).toBe("RESOURCE_OWNERSHIP_REQUIRED");
    });

    it("カスタムチェックに失敗する場合、失敗結果を返すこと", async () => {
      // モックのworkリポジトリを登録
      const mockWorkRepository = {
        findById: jest.fn().mockResolvedValue({ id: "1", childId: "1" })
      };
      resourcePermissionChecker.registerRepository("work", mockWorkRepository);

      // workリソースのupdateにはカスタムチェックがある（承認済みworkは更新不可）
      const context: ResourcePermissionContext = {
        resourceType: "work",
        operation: "update",
        userRole: "Child",
        userId: "1",
        resourceId: "1",
        additionalData: {
          isApproved: true
        }
      };

      const result = await resourcePermissionChecker.checkPermission(context);
      expect(result.success).toBeFalsy();
      expect(result.errorCode).toBe("CUSTOM_PERMISSION_CHECK_FAILED");
    });
  });
});
