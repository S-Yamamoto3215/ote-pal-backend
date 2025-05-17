import { EmailVerificationToken } from "@/domain/entities/EmailVerificationToken";

/**
 * EmailVerificationToken エンティティのモックオブジェクトを生成するファクトリ関数
 *
 * @param override 基本値をオーバーライドするプロパティのオブジェクト
 * @returns EmailVerificationToken エンティティのモックオブジェクト
 */
export const createMockEmailVerificationToken = (override: {
  id?: number;
  token?: string;
  expiresAt?: Date;
  userId?: number;
  isExpired?: boolean | (() => boolean);
} = {}): EmailVerificationToken => {
  // デフォルトの有効期限は現在から1時間後
  const defaultExpiresAt = new Date();
  defaultExpiresAt.setHours(defaultExpiresAt.getHours() + 1);

  const defaultProps = {
    id: 1,
    token: "test-verification-token",
    expiresAt: defaultExpiresAt,
    userId: 1
  };

  // オーバーライドプロパティを適用
  const mergedProps = { ...defaultProps, ...override };

  // EmailVerificationToken オブジェクトを生成
  const token = new EmailVerificationToken(
    mergedProps.token,
    mergedProps.expiresAt,
    mergedProps.userId
  );

  // IDを手動設定（コンストラクタでは設定されない）
  if (mergedProps.id !== undefined) {
    Object.defineProperty(token, 'id', {
      value: mergedProps.id,
      writable: true,
      enumerable: true,
    });
  }

  // isExpired メソッドをモック化する必要がある場合のためのサポート
  if (override.isExpired !== undefined) {
    token.isExpired = typeof override.isExpired === 'function'
      ? override.isExpired
      : () => !!override.isExpired;
  }

  return token;
};
