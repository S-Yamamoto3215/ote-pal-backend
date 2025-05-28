import { UserRole, RoleCheckResult, RoleCondition, CustomRoleCheckFn } from "./types";

/**
 * ロールチェッカーインターフェース
 * ユーザーロールの検証に関する機能を定義
 */
export interface IRoleChecker {
  /**
   * ユーザーが親ロールを持っているか検証
   * @param role ユーザーロール
   * @returns 検証結果
   */
  isParent(role: UserRole): RoleCheckResult;

  /**
   * ユーザーが子ロールを持っているか検証
   * @param role ユーザーロール
   * @returns 検証結果
   */
  isChild(role: UserRole): RoleCheckResult;

  /**
   * ユーザーが指定されたロールを持っているか検証
   * @param role ユーザーロール
   * @param expectedRole 期待するロール
   * @returns 検証結果
   */
  hasRole(role: UserRole, expectedRole: UserRole): RoleCheckResult;

  /**
   * ユーザーが指定されたロールのいずれかを持っているか検証（OR条件）
   * @param role ユーザーロール
   * @param expectedRoles 期待するロールの配列
   * @returns 検証結果
   */
  hasAnyRole(role: UserRole, expectedRoles: UserRole[]): RoleCheckResult;

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
  ): RoleCheckResult;

  /**
   * カスタムロールチェックを実行
   * @param role ユーザーロール
   * @param checkFn カスタムチェック関数
   * @returns 検証結果
   */
  customRoleCheck(
    role: UserRole,
    checkFn: CustomRoleCheckFn
  ): RoleCheckResult;
}
