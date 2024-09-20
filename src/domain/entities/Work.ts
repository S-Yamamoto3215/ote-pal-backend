import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";

import { User } from "@/domain/entities/User";
import { Task } from "@/domain/entities/Task";
import { Payment } from "@/domain/entities/Payment";

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({
    update: false,
    unique: true,
  })
  payment_id: number;

  @Column({
    update: false,
  })
  task_id: number;

  @Column({
    update: false,
  })
  user_id: number;

  @Column({
    type: "enum",
    enum: ["InProgress", "Completed", "Approved", "Rejected"],
  })
  status: "InProgress" | "Completed" | "Approved" | "Rejected";

  @OneToOne(() => Payment)
  @JoinColumn()
  payment?: Payment;

  @ManyToOne(() => User, (user) => user.works)
  user?: User;

  @ManyToOne(() => Task, (task) => task.works)
  task?: Task;

  constructor(
    payment_id: number,
    task_id: number,
    user_id: number,
    status: "InProgress" | "Completed" | "Approved" | "Rejected"
  ) {
    this.payment_id = payment_id;
    this.task_id = task_id;
    this.user_id = user_id;
    this.status = status;
  }

  getId(): number | undefined {
    return this.id;
  }

  getPaymentId(): number {
    return this.payment_id;
  }

  getTaskId(): number {
    return this.task_id;
  }

  getUserId(): number {
    return this.user_id;
  }

  getStatus(): "InProgress" | "Completed" | "Approved" | "Rejected" {
    return this.status;
  }

  setId(id: number): void {
    this.id = id;
  }

  setPaymentId(payment_id: number): void {
    this.payment_id = payment_id;
  }

  setTaskId(task_id: number): void {
    this.task_id = task_id;
  }

  setUserId(user_id: number): void {
    this.user_id = user_id;
  }

  setStatus(
    status: "InProgress" | "Completed" | "Approved" | "Rejected"
  ): void {
    this.status = status;
  }
}
