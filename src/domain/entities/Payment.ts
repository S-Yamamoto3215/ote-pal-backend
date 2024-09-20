import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  private id?: number;

  @Column({
    update: false,
  })
  private work_id: number;

  @Column({
    update: false,
  })
  private user_id: number;

  @Column()
  private amount: number;

  @Column()
  private pay_date: Date;

  @Column()
  private approved: boolean;

  constructor(
    work_id: number,
    user_id: number,
    amount: number,
    pay_date: Date,
    approved: boolean
  ) {
    this.work_id = work_id;
    this.user_id = user_id;
    this.amount = amount;
    this.pay_date = pay_date;
    this.approved = approved;
  }

  getId(): number | undefined {
    return this.id;
  }

  getWorkId(): number {
    return this.work_id;
  }

  getUserId(): number {
    return this.user_id;
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

  setWorkId(work_id: number): void {
    this.work_id = work_id;
  }

  setUserId(user_id: number): void {
    this.user_id = user_id;
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
