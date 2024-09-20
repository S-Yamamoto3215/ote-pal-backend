import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class Family {
  @PrimaryGeneratedColumn()
  private id?: number;

  @Column()
  private name: string;

  @Column()
  private payment_schedule: Date;

  @OneToMany(() => User, (user) => user.family)
  users!: User[];

  @OneToMany(() => Task, (task) => task.family)
  tasks!: Task[];

  constructor(name: string, payment_schedule: Date) {
    this.name = name;
    this.payment_schedule = payment_schedule;
  }

  getId(): number | undefined {
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
