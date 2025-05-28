import { UserRole, RoleCheckResult, RoleCondition, CustomRoleCheckFn } from "./role/types";
import { IRoleChecker } from "./role/IRoleChecker";
import { RoleChecker } from "./role/RoleChecker";
import { UserPermissionUtil } from "./UserPermissionUtil";

// シングルトンインスタンスを作成
const roleChecker: IRoleChecker = new RoleChecker();

// 便利なヘルパー関数をエクスポート

/**
 * ユーザーが親ロールを持っているか検証
 * @param role ユーザーロール
 * @returns 検証結果
 */
export const isParent = (role: UserRole): RoleCheckResult => {
  return roleChecker.isParent(role);
};

/**
 * ユーザーが子ロールを持っているか検証
 * @param role ユーザーロール
 * @returns 検証結果
 */
export const isChild = (role: UserRole): RoleCheckResult => {
  return roleChecker.isChild(role);
};

/**
 * ユーザーが指定されたロールを持っているか検証
 * @param role ユーザーロール
 * @param expectedRole 期待するロール
 * @returns 検証結果
 */
export const hasRole = (role: UserRole, expectedRole: UserRole): RoleCheckResult => {
  return roleChecker.hasRole(role, expectedRole);
};

/**
 * ユーザーが指定されたロールのいずれかを持っているか検証（OR条件）
 * @param role ユーザーロール
 * @param expectedRoles 期待するロールの配列
 * @returns 検証結果
 */
export const hasAnyRole = (role: UserRole, expectedRoles: UserRole[]): RoleCheckResult => {
  return roleChecker.hasAnyRole(role, expectedRoles);
};

/**
 * 条件作成ヘルパー
 */
export const createRoleCondition = RoleChecker.createRoleCondition;
export const createCustomCondition = RoleChecker.createCustomCondition;

// 型とクラスのエクスポート
export { UserRole, RoleCheckResult, RoleCondition, CustomRoleCheckFn };
export { IRoleChecker, RoleChecker };
export { UserPermissionUtil };
