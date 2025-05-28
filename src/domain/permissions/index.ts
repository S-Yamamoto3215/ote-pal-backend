// ロールベース権限管理
import { UserRole, RoleCheckResult, RoleCondition, CustomRoleCheckFn } from "./role/types";
import { IRoleChecker } from "./role/IRoleChecker";
import { RoleChecker } from "./role/RoleChecker";
import { UserPermissionUtil } from "./UserPermissionUtil";

// リソースベース権限管理
import {
  ResourceType,
  OperationType,
  ResourcePermissionResult,
  ResourcePermissionContext,
  ResourceOwnershipContext,
  CustomPermissionCheckFn,
  PermissionPolicy
} from "./resource/types";
import { IResourcePermissionChecker } from "./resource/IResourcePermissionChecker";
import { ResourcePermissionChecker } from "./resource/ResourcePermissionChecker";
import { ResourcePermissionMatrix } from "./resource/ResourcePermissionMatrix";
import { ResourcePermissionUtil } from "./resource/ResourcePermissionUtil";

// シングルトンインスタンスを作成
const roleChecker: IRoleChecker = new RoleChecker();
const resourcePermissionChecker: IResourcePermissionChecker = new ResourcePermissionChecker();

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

// リソース権限チェック関連のヘルパー関数
export const canAccessResource = ResourcePermissionUtil.canAccess;
export const requirePermission = ResourcePermissionUtil.requirePermission;
export const requireResourceOwnership = ResourcePermissionUtil.requireResourceOwnership;
export const registerResourceRepository = ResourcePermissionUtil.registerRepository;

// 型とクラスのエクスポート（ロールベース）
export { UserRole, RoleCheckResult, RoleCondition, CustomRoleCheckFn };
export { IRoleChecker, RoleChecker };
export { UserPermissionUtil };

// 型とクラスのエクスポート（リソースベース）
export {
  ResourceType, OperationType, ResourcePermissionResult,
  ResourcePermissionContext, ResourceOwnershipContext,
  CustomPermissionCheckFn, PermissionPolicy
};
export { IResourcePermissionChecker, ResourcePermissionChecker };
export { ResourcePermissionMatrix, ResourcePermissionUtil };
