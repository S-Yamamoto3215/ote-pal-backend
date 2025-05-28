import { ResourcePermissionChecker } from "./ResourcePermissionChecker";
import {
  ResourceType,
  OperationType,
  ResourcePermissionContext
} from "./types";
import { AppError } from "@/infrastructure/errors/AppError";

/**
 * リソース権限ユーティリティクラス
 * ユースケース内で使用するためのヘルパーメソッドを提供
 */
export class ResourcePermissionUtil {
  private static permissionChecker: ResourcePermissionChecker;

  /**
   * 権限チェッカーの初期化
   */
  static initialize(checker?: ResourcePermissionChecker): void {
    this.permissionChecker = checker || new ResourcePermissionChecker();
  }

  /**
   * 権限チェッカーの取得（必要に応じて初期化）
   */
  private static getChecker(): ResourcePermissionChecker {
    if (!this.permissionChecker) {
      this.initialize();
    }
    return this.permissionChecker;
  }

  /**
   * リソースへのアクセス権限をチェック
   * 権限がない場合は例外をスロー
   *
   * @param context 権限チェックのコンテキスト
   * @throws AppError 権限がない場合
   */
  static async requirePermission(context: ResourcePermissionContext): Promise<void> {
    const result = await this.getChecker().checkPermission(context);
    if (!result.success) {
      throw new AppError(
        "Forbidden",
        result.errorMessage || "このリソースへのアクセス権限がありません",
      );
    }
  }

  /**
   * ユーザーがリソース所有者かどうかをチェック
   * 所有者でない場合は例外をスロー
   *
   * @param userId ユーザーID
   * @param resourceId リソースID
   * @param resourceType リソースタイプ
   * @throws AppError 所有者でない場合
   */
  static async requireResourceOwnership(
    userId: string,
    resourceId: string,
    resourceType: ResourceType
  ): Promise<void> {
    const isOwner = await this.getChecker().isResourceOwner({
      userId,
      resourceId,
      resourceType
    });

    if (!isOwner) {
      throw new AppError(
        "Forbidden",
        "このリソースを操作する権限がありません",
      );
    }
  }

  /**
   * リソースリポジトリを登録
   * @param resourceType リソースタイプ
   * @param repository リポジトリインスタンス
   */
  static registerRepository(resourceType: string, repository: any): void {
    this.permissionChecker.registerRepository(resourceType, repository);
  }

  /**
   * 指定されたリソースに対する操作が特定のロールに許可されているかチェック
   * @param resourceType リソースタイプ
   * @param operation 操作タイプ
   * @param role ユーザーロール
   * @returns 許可されていればtrue、そうでなければfalse
   */
  static isOperationAllowed(
    resourceType: ResourceType,
    operation: OperationType,
    role: string
  ): boolean {
    return this.permissionChecker.isOperationAllowedForRole(resourceType, operation, role);
  }

  /**
   * リソース権限を簡易的にチェックし結果を返す（例外をスローしない）
   * @param resourceType リソースタイプ
   * @param operation 操作タイプ
   * @param userRole ユーザーロール
   * @returns 権限があればtrue、なければfalse
   */
  static canAccess(
    resourceType: ResourceType,
    operation: OperationType,
    userRole: string
  ): boolean {
    return this.isOperationAllowed(resourceType, operation, userRole);
  }
}
