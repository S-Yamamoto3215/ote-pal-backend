import { User } from "@/domain/entities/User";
import { UserRole, RoleChecker, RoleCheckResult } from "@/domain/permissions";
import { AppError } from "@/infrastructure/errors/AppError";

/**
 * ユーザー権限検証ユーティリティクラス
 * ユースケース内で使用するためのロール検証ヘルパー
 */
export class UserPermissionUtil {
  private static roleChecker = new RoleChecker();

  /**
   * ユーザーが親ロールを持っているか検証し、持っていなければエラーをスロー
   * @param user ユーザーもしくはロール文字列
   * @throws AppError 権限がない場合
   */
  static requireParentRole(user: User | UserRole): void {
    const role = typeof user === 'string' ? user : user.role;
    const result = this.roleChecker.isParent(role);

    if (!result.success) {
      throw new AppError(
        "Forbidden",
        result.errorMessage || "親ユーザー権限が必要です",
      );
    }
  }

  /**
   * ユーザーが子ロールを持っているか検証し、持っていなければエラーをスロー
   * @param user ユーザーもしくはロール文字列
   * @throws AppError 権限がない場合
   */
  static requireChildRole(user: User | UserRole): void {
    const role = typeof user === 'string' ? user : user.role;
    const result = this.roleChecker.isChild(role);

    if (!result.success) {
      throw new AppError(
        "Forbidden",
        result.errorMessage || "子ユーザー権限が必要です",
      );
    }
  }

  /**
   * ユーザーが特定のロールを持っているか検証し、持っていなければエラーをスロー
   * @param user ユーザーもしくはロール文字列
   * @param expectedRole 期待するロール
   * @throws AppError 権限がない場合
   */
  static requireRole(user: User | UserRole, expectedRole: UserRole): void {
    const role = typeof user === 'string' ? user : user.role;
    const result = this.roleChecker.hasRole(role, expectedRole);

    if (!result.success) {
      throw new AppError(
        "Forbidden",
        result.errorMessage || `${expectedRole}権限が必要です`,
      );
    }
  }

  /**
   * ユーザーが指定されたいずれかのロールを持っているか検証し、持っていなければエラーをスロー
   * @param user ユーザーもしくはロール文字列
   * @param expectedRoles 期待するロールの配列
   * @throws AppError 権限がない場合
   */
  static requireAnyRole(user: User | UserRole, expectedRoles: UserRole[]): void {
    const role = typeof user === 'string' ? user : user.role;
    const result = this.roleChecker.hasAnyRole(role, expectedRoles);

    if (!result.success) {
      throw new AppError(
        "Forbidden",
        result.errorMessage || `必要な権限がありません`,
      );
    }
  }

  /**
   * ユーザーロールをチェックして結果を返す（例外をスローしない）
   * @param user ユーザーもしくはロール文字列
   * @param expectedRole 期待するロール
   * @returns チェック結果
   */
  static checkRole(user: User | UserRole, expectedRole: UserRole): RoleCheckResult {
    const role = typeof user === 'string' ? user : user.role;
    return this.roleChecker.hasRole(role, expectedRole);
  }

  /**
   * カスタムロールチェックを実行し、失敗した場合はエラーをスロー
   * @param user ユーザーもしくはロール文字列
   * @param checkFn チェック関数
   * @param errorMessage エラー時のメッセージ
   * @throws AppError 権限チェックに失敗した場合
   */
  static requireCustomCheck(
    user: User | UserRole,
    checkFn: (role: UserRole) => boolean,
    errorMessage = "権限がありません"
  ): void {
    const role = typeof user === 'string' ? user : user.role;
    const result = this.roleChecker.customRoleCheck(role, checkFn);

    if (!result.success) {
      throw new AppError(
        "Forbidden",
        errorMessage,
      );
    }
  }

  /**
   * ユーザーが親ロールを持っているか確認
   * @param user ユーザーもしくはロール文字列
   * @returns 親ロールを持っているか
   */
  static isParent(user: User | UserRole): boolean {
    const role = typeof user === 'string' ? user : user.role;
    return role === "Parent";
  }

  /**
   * ユーザーが子ロールを持っているか確認
   * @param user ユーザーもしくはロール文字列
   * @returns 子ロールを持っているか
   */
  static isChild(user: User | UserRole): boolean {
    const role = typeof user === 'string' ? user : user.role;
    return role === "Child";
  }
}
