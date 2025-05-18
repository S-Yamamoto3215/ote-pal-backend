import { Family } from "@/domain/entities/Family";

export const createMockFamily = (override: {
  id?: number;
  name?: string;
  payment_schedule?: number;
} = {}): Family => {
  const defaultProps = {
    id: 1,
    name: "テスト家族",
    payment_schedule: 1
  };

  const mergedProps = { ...defaultProps, ...override };

  const family = new Family(
    mergedProps.name,
    mergedProps.payment_schedule
  );

  if (mergedProps.id !== undefined) {
    Object.defineProperty(family, 'id', {
      value: mergedProps.id,
      writable: true,
      enumerable: true,
    });
  }

  return family;
};
