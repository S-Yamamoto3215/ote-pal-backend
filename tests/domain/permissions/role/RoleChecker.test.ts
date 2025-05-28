import { RoleChecker } from "@/domain/permissions/role/RoleChecker";
import { UserRole, RoleCondition } from "@/domain/permissions/role/types";

describe("RoleChecker", () => {
  let roleChecker: RoleChecker;

  beforeEach(() => {
    roleChecker = new RoleChecker();
  });

  describe("isParent", () => {
    it("Parentロールの場合、成功結果を返すこと", () => {
      const result = roleChecker.isParent("Parent");
      expect(result.success).toBeTruthy();
    });

    it("Parent以外のロールの場合、失敗結果を返すこと", () => {
      const result = roleChecker.isParent("Child");
      expect(result.success).toBeFalsy();
      expect(result.errorCode).toBe("PERMISSION_DENIED");
      expect(result.errorMessage).toBe("親ユーザー権限が必要です");
      expect(result.statusCode).toBe(403);
    });
  });

  describe("isChild", () => {
    it("Childロールの場合、成功結果を返すこと", () => {
      const result = roleChecker.isChild("Child");
      expect(result.success).toBeTruthy();
    });

    it("Child以外のロールの場合、失敗結果を返すこと", () => {
      const result = roleChecker.isChild("Parent");
      expect(result.success).toBeFalsy();
      expect(result.errorCode).toBe("PERMISSION_DENIED");
      expect(result.errorMessage).toBe("子ユーザー権限が必要です");
      expect(result.statusCode).toBe(403);
    });
  });

  describe("hasRole", () => {
    it("指定したロールと一致する場合、成功結果を返すこと", () => {
      const result = roleChecker.hasRole("Parent", "Parent");
      expect(result.success).toBeTruthy();
    });

    it("指定したロールと一致しない場合、失敗結果を返すこと", () => {
      const result = roleChecker.hasRole("Child", "Parent");
      expect(result.success).toBeFalsy();
      expect(result.errorCode).toBe("PERMISSION_DENIED");
      expect(result.errorMessage).toContain("権限が必要です");
    });
  });

  describe("hasAnyRole", () => {
    it("許可されたロールのいずれかと一致する場合、成功結果を返すこと", () => {
      const result = roleChecker.hasAnyRole("Parent", ["Parent", "Child"]);
      expect(result.success).toBeTruthy();
    });

    it("許可されたロールのいずれとも一致しない場合、失敗結果を返すこと", () => {
      // Adminは実際には存在しないロール型だが、Child/Parent以外でテスト
      const result = roleChecker.hasAnyRole("Child", ["Parent"]);
      expect(result.success).toBeFalsy();
      expect(result.errorCode).toBe("PERMISSION_DENIED");
      expect(result.errorMessage).toContain("必要な権限がありません");
    });
  });

  describe("checkRoleConditions", () => {
    it("すべての条件と一致する場合、成功結果を返すこと", () => {
      // 通常は単一のロールしか持たないが、テストのために一致するケースを検証
      const conditions: RoleCondition[] = [
        { type: "ROLE", check: (role) => role === "Parent" }
      ];
      const result = roleChecker.checkRoleConditions("Parent", conditions, "ALL");
      expect(result.success).toBeTruthy();
    });

    it("すべての条件に一致しない場合、失敗結果を返すこと", () => {
      const conditions: RoleCondition[] = [
        { type: "ROLE", check: (role) => role === "Parent" },
        { type: "ROLE", check: (role) => role === "Child" }
      ];
      const result = roleChecker.checkRoleConditions("Parent", conditions, "ALL");
      expect(result.success).toBeFalsy();
    });
  });

  describe("checkRoleConditions with ANY/ALL types", () => {
    it("条件がANY、いずれかの条件が真の場合、成功結果を返すこと", () => {
      const conditions: RoleCondition[] = [
        { type: "ROLE", check: (role) => role === "Parent" },
        { type: "ROLE", check: (role) => role === "Child" }
      ];
      const result = roleChecker.checkRoleConditions("Parent", conditions, "ANY");
      expect(result.success).toBeTruthy();
    });

    it("条件がANY、すべての条件が偽の場合、失敗結果を返すこと", () => {
      // Parentが持っていない条件（Child=Childのみ）をチェック
      const conditions: RoleCondition[] = [
        { type: "ROLE", check: (role) => role !== "Parent" && role === "Child" },
        { type: "ROLE", check: (role) => role !== "Parent" && role === "Child" }
      ];
      const result = roleChecker.checkRoleConditions("Parent", conditions, "ANY");
      expect(result.success).toBeFalsy();
    });

    it("条件がALL、すべての条件が真の場合、成功結果を返すこと", () => {
      const conditions: RoleCondition[] = [
        { type: "ROLE", check: (role) => role === "Parent" }
      ];
      const result = roleChecker.checkRoleConditions("Parent", conditions, "ALL");
      expect(result.success).toBeTruthy();
    });

    it("条件がALL、いずれかの条件が偽の場合、失敗結果を返すこと", () => {
      const conditions: RoleCondition[] = [
        { type: "ROLE", check: (role) => role === "Parent" },
        { type: "ROLE", check: (role) => role === "Child" }
      ];
      const result = roleChecker.checkRoleConditions("Parent", conditions, "ALL");
      expect(result.success).toBeFalsy();
    });
  });

  describe("customRoleCheck", () => {
    it("カスタムチェック関数がtrueを返す場合、成功結果を返すこと", () => {
      const checkFn = (role: UserRole) => role === "Parent";
      const result = roleChecker.customRoleCheck("Parent", checkFn);
      expect(result.success).toBeTruthy();
    });

    it("カスタムチェック関数がfalseを返す場合、失敗結果を返すこと", () => {
      const checkFn = (role: UserRole) => role === "Child";
      const result = roleChecker.customRoleCheck("Parent", checkFn);
      expect(result.success).toBeFalsy();
      expect(result.errorCode).toBe("PERMISSION_DENIED");
    });
  });
});
