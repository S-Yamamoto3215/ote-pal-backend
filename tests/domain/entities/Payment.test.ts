import { Payment } from "@/domain/entities/Payment";

describe('Payment Entity', () => {
  let payment: Payment;

  beforeEach(() => {
    payment = new Payment(100, new Date('2023-10-01'), true);
  });

  it('should create a payment instance', () => {
    expect(payment).toBeInstanceOf(Payment);
    expect(payment.getAmount()).toBe(100);
    expect(payment.getPayDate()).toEqual(new Date('2023-10-01'));
    expect(payment.getApproved()).toBe(true);
  });

  it('should get and set id', () => {
    payment.setId(1);
    expect(payment.getId()).toBe(1);
  });

  it('should get and set amount', () => {
    payment.setAmount(200);
    expect(payment.getAmount()).toBe(200);
  });

  it('should get and set pay_date', () => {
    const newDate = new Date('2023-11-01');
    payment.setPayDate(newDate);
    expect(payment.getPayDate()).toEqual(newDate);
  });

  it('should get and set approved', () => {
    payment.setApproved(false);
    expect(payment.getApproved()).toBe(false);
  });
});
