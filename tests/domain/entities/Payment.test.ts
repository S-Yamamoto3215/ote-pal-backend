import { Payment } from "@/domain/entities/Payment";

describe('Payment Entity', () => {
  const validParams = {
    amount: 100,
    pay_date: new Date("2023-10-01"),
    approved: true,
  };

  describe("constructor", () => {
    it("should create a Payment when valid parameters are provided", () => {
      const { amount, pay_date, approved } = validParams;

      const payment = new Payment(amount, pay_date, approved);

      expect(payment.amount).toBe(amount);
      expect(payment.pay_date).toEqual(pay_date);
      expect(payment.approved).toBe(approved);
    });
  });

  // describe("validate", () => {
    // it("should {$expectedValue} when {$conditions}", () => {});
    // it("should throw {$ErrorType} when {$conditions}", () => {});
  // });
});
