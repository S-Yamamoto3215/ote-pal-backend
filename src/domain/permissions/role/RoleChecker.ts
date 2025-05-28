import { IRoleChecker } from "./IRoleChecker";
import { UserRole, RoleCheckResult, RoleCondition, CustomRoleCheckFn } from "./types";

/**
 * ロールチェッカークラス
 * ユーザーロールに基づいた権限チェックを提供
 */
export class RoleChecker implements IRoleChecker {
  /**
   * ユーザーが親ロールを持っているか検証
   * @param role ユーザーロール
   * @returns 検証結果
   */
  isParent(role: UserRole): RoleCheckResult {
    const isParentRole = role === "Parent";

    if (isParentRole) {
      return { success: true };
    } else {
      return {
        success: false,
        errorCode: "PERMISSION_DENIED",
        errorMessage: "親ユーザー権限が必要です",
        statusCode: 403
      };
    }
  }

  /**
   * ユーザーが子ロールを持っているか検証
   * @param role ユーザーロール
   * @returns 検証結果
   */
  isChild(role: UserRole): RoleCheckResult {
    const isChildRole = role === "Child";

    if (isChildRole) {
      return { success: true };
    } else {
      return {
        success: false,
        errorCode: "PERMISSION_DENIED",
        errorMessage: "子ユーザー権限が必要です",
        statusCode: 403
      };
    }
  }

  /**
   * ユーザーが指定されたロールを持っているか検証
   * @param role ユーザーロール
   * @param expectedRole 期待するロール
   * @returns 検証結果
   */
  hasRole(role: UserRole, expectedRole: UserRole): RoleCheckResult {
    const hasExpectedRole = role === expectedRole;

    if (hasExpectedRole) {
      return { success: true };
    } else {
      return {
        success: false,
        errorCode: "PERMISSION_DENIED",
        errorMessage: `${expectedRole}権限が必要です`,
        statusCode: 403
      };
    }
  }

  /**
   * ユーザーが指定されたロールのいずれかを持っているか検証（OR条件）
   * @param role ユーザーロール
   * @param expectedRoles 期待するロールの配列
   * @returns 検証結果
   */
  hasAnyRole(role: UserRole, expectedRoles: UserRole[]): RoleCheckResult {
    if (expectedRoles.includes(role)) {
      return { success: true };
    } else {
      return {
        success: false,
        errorCode: "PERMISSION_DENIED",
        errorMessage: `必要な権限がありません。必要な権限: ${expectedRoles.join(', ')}`,
        statusCode: 403
      };
    }
  }

  /**
   * 複合条件でロールをチェック
   * @param role ユーザーロール
   * @param conditions 検証条件の配列
   * @param checkType 'ALL' = すべての条件を満たす必要あり, 'ANY' = いずれかの条件を満たせばOK
   * @returns 検証結果
   */
  checkRoleConditions(
    role: UserRole,
    conditions: RoleCondition[],
    checkType: 'ALL' | 'ANY'
  ): RoleCheckResult {
    if (conditions.length === 0) {
      return { success: true };
    }

    const results = conditions.map(condition => condition.check(role));

    if (checkType === 'ALL') {
      // すべての条件を満たす必要がある場合
      const allPassed = results.every(result => result === true);

      if (allPassed) {
        return { success: true };
      } else {
        return {
          success: false,
          errorCode: "PERMISSION_DENIED",
          errorMessage: "すべての権限条件を満たしていません",
          statusCode: 403
        };
      }
    } else {
      // いずれかの条件を満たせばOKの場合
      const anyPassed = results.some(result => result === true);

      if (anyPassed) {
        return { success: true };
      } else {
        return {
          success: false,
          errorCode: "PERMISSION_DENIED",
          errorMessage: "必要な権限条件を満たしていません",
          statusCode: 403
        };
      }
    }
  }

  /**
   * カスタムロールチェックを実行
   * @param role ユーザーロール
   * @param checkFn カスタムチェック関数
   * @returns 検証結果
   */
  customRoleCheck(
    role: UserRole,
    checkFn: CustomRoleCheckFn
  ): RoleCheckResult {
    const passed = checkFn(role);

    if (passed) {
      return { success: true };
    } else {
      return {
        success: false,
        errorCode: "PERMISSION_DENIED",
        errorMessage: "権限がありません",
        statusCode: 403
      };
    }
  }

  /**
   * ロールチェック条件を作成するヘルパー
   * @param checkFn ロールチェック関数
   * @returns ロールチェック条件オブジェクト
   */
  static createRoleCondition(checkFn: (role: UserRole) => boolean): RoleCondition {
    return {
      type: "ROLE",
      check: checkFn
    };
  }

  /**
   * カスタム条件を作成するヘルパー
   * @param checkFn カスタムチェック関数
   * @returns カスタムチェック条件オブジェクト
   */
  static createCustomCondition(checkFn: CustomRoleCheckFn): RoleCondition {
    return {
      type: "CUSTOM",
      check: checkFn
    };
  }
}
