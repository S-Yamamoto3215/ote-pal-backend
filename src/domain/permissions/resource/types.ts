/**
 * リソースタイプの列挙型
 */
export type ResourceType =
  | "family"
  | "task"
  | "taskDetail"
  | "work"
  | "payment"
  | "profile";

/**
 * 操作タイプの列挙型
 */
export type OperationType = "create" | "read" | "update" | "delete" | "approve";

/**
 * リソース権限チェック結果の型定義
 */
export interface ResourcePermissionResult {
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  statusCode?: number;
}

/**
 * リソース所有権チェックに必要なコンテキスト情報
 */
export interface ResourceOwnershipContext {
  userId: string;
  resourceId: string;
  resourceType: ResourceType;
}

/**
 * リソース権限チェックのコンテキスト情報
 */
export interface ResourcePermissionContext {
  resourceType: ResourceType;
  operation: OperationType;
  userRole: string;
  userId?: string;
  resourceId?: string;
  resourceOwnerId?: string;
  additionalData?: Record<string, any>;
}

/**
 * カスタム権限チェック関数の型
 */
export type CustomPermissionCheckFn = (context: ResourcePermissionContext) => boolean;

/**
 * 権限ポリシーの定義
 */
export interface PermissionPolicy {
  resourceType: ResourceType;
  allowedRoles: {
    create?: string[];
    read?: string[];
    update?: string[];
    delete?: string[];
    approve?: string[];
  };
  requiresOwnership?: {
    read?: boolean;
    update?: boolean;
    delete?: boolean;
  };
  customChecks?: {
    create?: CustomPermissionCheckFn[];
    read?: CustomPermissionCheckFn[];
    update?: CustomPermissionCheckFn[];
    delete?: CustomPermissionCheckFn[];
    approve?: CustomPermissionCheckFn[];
  };
}
