export class Family {
  constructor(
    private id: number | null,
    private name: string,
    private payment_schedule: Date,
  ) {
    this.id = id;
    this.name = name;
    this.payment_schedule = payment_schedule;
  }

  getId(): number | null {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPaymentSchedule(): Date {
    return this.payment_schedule;
  }

  setId(id: number): void {
    this.id = id;
  }

  setName(name: string): void {
    this.name = name;
  }

  setPaymentSchedule(payment_schedule: Date): void {
    this.payment_schedule = payment_schedule;
  }
}
