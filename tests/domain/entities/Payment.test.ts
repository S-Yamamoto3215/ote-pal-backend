import { Payment } from "@/domain/entities/Payment";

describe('Payment Entity', () => {
  const validParams = {
    amount: 100,
    pay_date: new Date("2023-10-01"),
    approved: true,
  };

  it('should create a payment instance', () => {
    const payment = new Payment(
      validParams.amount,
      validParams.pay_date,
      validParams.approved
    );

    expect(payment.amount).toBe(validParams.amount);
    expect(payment.pay_date).toEqual(validParams.pay_date);
    expect(payment.approved).toBe(validParams.approved);
  });
});
