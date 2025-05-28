import { ResourcePermissionMatrix } from "@/domain/permissions/resource/ResourcePermissionMatrix";
import { PermissionPolicy, ResourceType, OperationType } from "@/domain/permissions/resource/types";

describe("ResourcePermissionMatrix", () => {
  // テスト後にポリシーを元に戻すため、元のポリシーを保存
  let originalPolicies: any;

  beforeEach(() => {
    // 注: 実際の実装に合わせて、ポリシーを取得/保存する方法は調整が必要かもしれません
    originalPolicies = Object.assign({}, ResourcePermissionMatrix["policies"]);
  });

  afterEach(() => {
    // テスト後にポリシーを元に戻す
    Object.assign(ResourcePermissionMatrix["policies"], originalPolicies);
  });

  describe("isOperationAllowedForRole", () => {
    it("特定のロールに許可された操作の場合、trueを返すこと", () => {
      // task作成はParentに許可されている
      const result = ResourcePermissionMatrix.isOperationAllowedForRole("task", "create", "Parent");
      expect(result).toBeTruthy();
    });

    it("特定のロールに許可されていない操作の場合、falseを返すこと", () => {
      // task作成はChildには許可されていない
      const result = ResourcePermissionMatrix.isOperationAllowedForRole("task", "create", "Child");
      expect(result).toBeFalsy();
    });

    it("存在しないリソースタイプの場合、falseを返すこと", () => {
      const result = ResourcePermissionMatrix.isOperationAllowedForRole("nonExistingResource" as ResourceType, "read", "Parent");
      expect(result).toBeFalsy();
    });

    it("存在しない操作の場合、falseを返すこと", () => {
      const result = ResourcePermissionMatrix.isOperationAllowedForRole("task", "nonExistingOperation" as OperationType, "Parent");
      expect(result).toBeFalsy();
    });
  });

  describe("requiresOwnershipCheck", () => {
    it("所有者チェックが必要な操作の場合、trueを返すこと", () => {
      // taskの更新は所有者チェックが必要
      const result = ResourcePermissionMatrix.requiresOwnershipCheck("task", "update");
      expect(result).toBeTruthy();
    });

    it("所有者チェックが不要な操作の場合、falseを返すこと", () => {
      // familyの読み取りは所有者チェックが不要 (requiresOwnership.readがfalse)
      const result = ResourcePermissionMatrix.requiresOwnershipCheck("family", "read");
      expect(result).toBeFalsy();
    });

    it("所有権チェック設定がない操作の場合、falseを返すこと", () => {
      // ポリシーに所有権チェックが定義されていない場合
      const result = ResourcePermissionMatrix.requiresOwnershipCheck("taskDetail", "update");
      expect(result).toBeFalsy();
    });
  });

  describe("getCustomChecks", () => {
    it("カスタムチェックが定義されている場合、チェック関数の配列を返すこと", () => {
      // workの更新にはカスタムチェックがある
      const checks = ResourcePermissionMatrix.getCustomChecks("work", "update");
      expect(checks).toBeInstanceOf(Array);
      expect(checks.length).toBeGreaterThan(0);
      expect(typeof checks[0]).toBe("function");
    });

    it("カスタムチェックが定義されていない場合、空の配列を返すこと", () => {
      const checks = ResourcePermissionMatrix.getCustomChecks("task", "read");
      expect(checks).toBeInstanceOf(Array);
      expect(checks.length).toBe(0);
    });
  });

  describe("addPolicy", () => {
    it("新しいポリシーを追加できること", () => {
      const newPolicy: PermissionPolicy = {
        resourceType: "newResource" as ResourceType,
        allowedRoles: {
          create: ["Parent"],
          read: ["Parent", "Child"],
          update: ["Parent"]
        }
      };

      ResourcePermissionMatrix.addPolicy(newPolicy);

      const result = ResourcePermissionMatrix.isOperationAllowedForRole("newResource" as ResourceType, "read", "Child");
      expect(result).toBeTruthy();
    });

    it("既存のポリシーを上書きできること", () => {
      const updatedPolicy: PermissionPolicy = {
        resourceType: "task",
        allowedRoles: {
          create: ["Child"], // 元々はParentのみ
          read: ["Parent", "Child"],
          update: ["Parent"]
        }
      };

      ResourcePermissionMatrix.addPolicy(updatedPolicy);

      const result = ResourcePermissionMatrix.isOperationAllowedForRole("task", "create", "Child");
      expect(result).toBeTruthy();
    });
  });

  describe("updatePolicy", () => {
    it("既存のポリシーを部分的に更新できること", () => {
      const policyUpdates: Partial<PermissionPolicy> = {
        allowedRoles: {
          update: ["Parent", "Child"] // Childも更新可能に変更
        }
      };

      ResourcePermissionMatrix.updatePolicy("task", policyUpdates);

      const result = ResourcePermissionMatrix.isOperationAllowedForRole("task", "update", "Child");
      expect(result).toBeTruthy();
    });
  });
});
