/**
 * ユーザーロールの型定義
 */
export type UserRole = "Parent" | "Child";

/**
 * 権限チェック結果の型定義
 */
export interface RoleCheckResult {
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  statusCode?: number;
}

/**
 * ロールチェック条件の型定義
 */
export interface RoleCondition {
  type: "ROLE" | "CUSTOM";
  check: (role: UserRole) => boolean;
}

/**
 * カスタムロールチェック関数の型定義
 */
export type CustomRoleCheckFn = (role: UserRole) => boolean;
