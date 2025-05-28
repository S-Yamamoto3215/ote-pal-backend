import { IResourcePermissionChecker } from "./IResourcePermissionChecker";
import { ResourcePermissionMatrix } from "./ResourcePermissionMatrix";
import {
  ResourceType,
  OperationType,
  ResourcePermissionResult,
  ResourcePermissionContext,
  ResourceOwnershipContext,
  CustomPermissionCheckFn
} from "./types";

/**
 * リソース権限チェッカークラス
 * リソースベースの権限チェックを提供する実装クラス
 */
export class ResourcePermissionChecker implements IResourcePermissionChecker {
  // リソースリポジトリマッピング
  private resourceRepositories: Record<string, any> = {};

  /**
   * コンストラクタ
   * @param repositories リソースタイプとリポジトリのマッピング（オプション）
   */
  constructor(repositories?: Record<string, any>) {
    if (repositories) {
      this.resourceRepositories = repositories;
    }
  }

  /**
   * リソースリポジトリを登録
   * @param resourceType リソースタイプ
   * @param repository リポジトリインスタンス
   */
  registerRepository(resourceType: string, repository: any): void {
    this.resourceRepositories[resourceType] = repository;
  }

  /**
   * リソースへのアクセス権限をチェック
   * @param context 権限チェックのコンテキスト
   * @returns 権限チェック結果
   */
  async checkPermission(context: ResourcePermissionContext): Promise<ResourcePermissionResult> {
    try {
      // 1. ロールベースの権限チェック
      const hasRolePermission = this.isOperationAllowedForRole(
        context.resourceType,
        context.operation,
        context.userRole
      );

      if (!hasRolePermission) {
        return {
          success: false,
          errorCode: "PERMISSION_DENIED",
          errorMessage: `リソース '${context.resourceType}' に対する '${context.operation}' 操作の権限がありません`,
          statusCode: 403
        };
      }

      // 2. カスタムチェックの実行（順序を変更：カスタムチェックを先に実行）
      const customChecks = ResourcePermissionMatrix.getCustomChecks(
        context.resourceType,
        context.operation
      );

      for (const checkFn of customChecks) {
        const passed = this.executeCustomCheck(context, checkFn);
        if (!passed) {
          return {
            success: false,
            errorCode: "CUSTOM_PERMISSION_CHECK_FAILED",
            errorMessage: `リソースに対する操作が許可されていません`,
            statusCode: 403
          };
        }
      }

      // 3. 所有権チェックが必要かどうか確認
      const needsOwnershipCheck = this.requiresOwnershipCheck(
        context.resourceType,
        context.operation
      );

      // 4. 所有権チェックが必要な場合、実行
      if (needsOwnershipCheck && context.userId && context.resourceId) {
        const isOwner = await this.isResourceOwner({
          userId: context.userId,
          resourceId: context.resourceId,
          resourceType: context.resourceType
        });

        if (!isOwner) {
          return {
            success: false,
            errorCode: "RESOURCE_OWNERSHIP_REQUIRED",
            errorMessage: `このリソースを操作する権限がありません`,
            statusCode: 403
          };
        }
      }

      // すべてのチェックを通過
      return { success: true };
    } catch (error) {
      return {
        success: false,
        errorCode: "PERMISSION_CHECK_ERROR",
        errorMessage: error instanceof Error ? error.message : "権限チェック中にエラーが発生しました",
        statusCode: 500
      };
    }
  }

  /**
   * リソース所有者かどうかをチェック
   * @param context 所有権チェックのコンテキスト
   * @returns 所有者であればtrue、そうでなければfalse
   */
  async isResourceOwner(context: ResourceOwnershipContext): Promise<boolean> {
    // リポジトリが登録されていない場合エラーをスロー
    const repository = this.resourceRepositories[context.resourceType];
    if (!repository || !repository.findById) {
      throw new Error(`リソースタイプ ${context.resourceType} のリポジトリが登録されていません`);
    }

    try {
      // リソースを取得
      const resource = await repository.findById(context.resourceId);
      if (!resource) {
        return false;
      }

      // リソースのユーザーIDフィールドをチェック
      // リソースによって所有者を表すフィールド名が異なる場合に対応
      const ownerIdField = this.getOwnerIdFieldForResource(context.resourceType);
      return resource[ownerIdField] === context.userId;
    } catch (error) {
      console.error(`リソース所有権チェック中にエラーが発生しました:`, error);
      return false;
    }
  }

  /**
   * リソースタイプに応じた所有者IDフィールド名を取得
   * @param resourceType リソースタイプ
   * @returns 所有者IDを表すフィールド名
   */
  private getOwnerIdFieldForResource(resourceType: ResourceType): string {
    // リソースタイプに応じて適切なフィールド名を返す
    switch (resourceType) {
      case "family":
        return "ownerId";
      case "task":
        return "userId"; // テストと整合性を取るためuserId
      case "work":
        return "childId";
      case "profile":
        return "userId";
      default:
        return "userId"; // デフォルト
    }
  }

  /**
   * 指定されたリソースに対する操作が特定のロールに許可されているかチェ���ク
   * @param resourceType リソースタイプ
   * @param operation 操作タイプ
   * @param role ユーザーロール
   * @returns 許可されていればtrue、そうでなければfalse
   */
  isOperationAllowedForRole(
    resourceType: ResourceType,
    operation: OperationType,
    role: string
  ): boolean {
    return ResourcePermissionMatrix.isOperationAllowedForRole(resourceType, operation, role);
  }

  /**
   * カスタム条件によるチェックを実行
   * @param context 権限チェックのコンテキスト
   * @param checkFn カスタムチェック関数
   * @returns チェック結果
   */
  executeCustomCheck(
    context: ResourcePermissionContext,
    checkFn: CustomPermissionCheckFn
  ): boolean {
    return checkFn(context);
  }

  /**
   * 特定のリソースタイプと操作に対して所有者チェックが必要かどうか
   * @param resourceType リソースタイプ
   * @param operation 操作タイプ
   * @returns 所有者チェックが必要であればtrue、そうでなければfalse
   */
  requiresOwnershipCheck(resourceType: ResourceType, operation: OperationType): boolean {
    return ResourcePermissionMatrix.requiresOwnershipCheck(resourceType, operation);
  }
}
