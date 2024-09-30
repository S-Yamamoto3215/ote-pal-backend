import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  amount: number;

  @Column()
  pay_date: Date;

  @Column()
  approved: boolean;

  constructor(
    amount: number,
    pay_date: Date,
    approved: boolean
  ) {
    this.amount = amount;
    this.pay_date = pay_date;
    this.approved = approved;
  }
}
