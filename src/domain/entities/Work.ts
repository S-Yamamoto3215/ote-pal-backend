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
  id?: number;

  @Column({
    type: "enum",
    enum: ["InProgress", "Completed", "Approved", "Rejected"],
  })
  status: "InProgress" | "Completed" | "Approved" | "Rejected";

  @Column({
    update: false,
  })
  taskId: number;
  @ManyToOne(() => Task, (task) => task.works)
  readonly task!: Task;

  @Column({
    update: false,
  })
  userId: number;
  @ManyToOne(() => User, (user) => user.works)
  readonly user!: User;

  @OneToOne(() => Payment)
  @JoinColumn()
  payment!: Payment;

  constructor(
    status: "InProgress" | "Completed" | "Approved" | "Rejected",
    taskId: number,
    userId: number,
  ) {
    this.status = status;
    this.taskId = taskId;
    this.userId = userId;
  }
}
