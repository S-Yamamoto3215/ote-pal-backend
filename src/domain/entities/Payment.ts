import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  private id?: number;

  @Column()
  private amount: number;

  @Column()
  private pay_date: Date;

  @Column()
  private approved: boolean;

  constructor(
    amount: number,
    pay_date: Date,
    approved: boolean
  ) {
    this.amount = amount;
    this.pay_date = pay_date;
    this.approved = approved;
  }

  getId(): number | undefined {
    return this.id;
  }

  getAmount(): number {
    return this.amount;
  }

  getPayDate(): Date {
    return this.pay_date;
  }

  getApproved(): boolean {
    return this.approved;
  }

  setId(id: number): void {
    this.id = id;
  }

  setAmount(amount: number): void {
    this.amount = amount;
  }

  setPayDate(pay_date: Date): void {
    this.pay_date = pay_date;
  }

  setApproved(approved: boolean): void {
    this.approved = approved;
  }
}
