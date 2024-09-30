import { Payment } from "@/domain/entities/Payment";

describe('Payment Entity', () => {
  it('should create a payment instance', () => {
    const payment = new Payment(100, new Date("2023-10-01"), true);
    expect(payment).toBeInstanceOf(Payment);
    expect(payment.amount).toBe(100);
    expect(payment.pay_date).toEqual(new Date('2023-10-01'));
    expect(payment.approved).toBe(true);
  });
});
