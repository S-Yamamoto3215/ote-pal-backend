import { User } from "@/domain/entities/User";
import { Password } from "@/domain/valueObjects/Password";

/**
 * User エンティティのモックオブジェクトを生成するファクトリ関数
 *
 * @param override 基本値をオーバーライドするプロパティのオブジェクト
 * @returns User エンティティのモックオブジェクト
 */
export const createMockUser = (override: {
  id?: number;
  name?: string;
  email?: string;
  password?: Password;
  role?: "Parent" | "Child";
  isVerified?: boolean;
  familyId?: number | null;
} = {}): User => {
  // パスワードはモックで代用
  const mockPassword = new Password("password123");

  const defaultProps = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    password: mockPassword,
    role: "Parent",
    isVerified: false,
    familyId: null,
  };

  // オーバーライドプロパティを適用
  const mergedProps = { ...defaultProps, ...override };

  // User オブジェクトを生成
  const user = new User(
    mergedProps.name,
    mergedProps.email,
    mergedProps.password,
    mergedProps.role as "Parent" | "Child",
    mergedProps.isVerified,
    mergedProps.familyId
  );

  // IDを手動設定（コンストラクタでは設定されない）
  if (mergedProps.id !== undefined) {
    Object.defineProperty(user, 'id', {
      value: mergedProps.id,
      writable: true,
      enumerable: true,
    });
  }

  return user;
};
