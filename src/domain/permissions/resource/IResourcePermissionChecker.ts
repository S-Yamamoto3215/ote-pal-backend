import {
  ResourceType,
  OperationType,
  ResourcePermissionResult,
  ResourcePermissionContext,
  ResourceOwnershipContext,
  CustomPermissionCheckFn
} from "./types";

/**
 * リソース権限チェッカーのインターフェース
 * リソースベースの権限チェック機能を提供
 */
export interface IResourcePermissionChecker {
  /**
   * リソースへのアクセス権限をチェック
   * @param context 権限チェックのコンテキスト
   * @returns 権限チェック結果
   */
  checkPermission(context: ResourcePermissionContext): Promise<ResourcePermissionResult>;

  /**
   * リソース所有者かどうかをチェック
   * @param context 所有権チェックのコンテキスト
   * @returns 所有者であればtrue、そうでなければfalse
   */
  isResourceOwner(context: ResourceOwnershipContext): Promise<boolean>;

  /**
   * 指定されたリソースに対する操作が特定のロールに許可されているかチェック
   * @param resourceType リソースタイプ
   * @param operation 操作タイプ
   * @param role ユーザーロール
   * @returns 許可されていればtrue、そうでなければfalse
   */
  isOperationAllowedForRole(
    resourceType: ResourceType,
    operation: OperationType,
    role: string
  ): boolean;

  /**
   * カスタム条件によるチェックを実行
   * @param context 権限チェックのコンテキスト
   * @param checkFn カスタムチェック関数
   * @returns チェック結果
   */
  executeCustomCheck(
    context: ResourcePermissionContext,
    checkFn: CustomPermissionCheckFn
  ): boolean;

  /**
   * 特定のリソースタイプと操作に対して所有者チェックが必要かどうか
   * @param resourceType リソースタイプ
   * @param operation 操作タイプ
   * @returns 所有者チェックが必要であればtrue、そうでなければfalse
   */
  requiresOwnershipCheck(resourceType: ResourceType, operation: OperationType): boolean;
}
