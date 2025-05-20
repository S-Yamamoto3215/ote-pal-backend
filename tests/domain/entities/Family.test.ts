import { Family } from "@/domain/entities/Family";

describe("Family Entity", () => {
  const validParams = {
    name: "Test Family 1",
    payment_schedule: 1,
  };

  describe("constructor", () => {
    it("should create a Family when valid parameters are provided", () => {
      const { name, payment_schedule } = validParams;

      const family = new Family(name, payment_schedule);

      expect(family.name).toBe(name);
      expect(family.payment_schedule).toBe(payment_schedule);
    });
  });

  // describe("validate", () => {
    // it("should {$expectedValue} when {$conditions}", () => {});
    // it("should throw {$ErrorType} when {$conditions}", () => {});
  // });
});
