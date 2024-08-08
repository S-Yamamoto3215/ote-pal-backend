import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class Work extends BaseEntity {
  @Column({ type: "enum", enum: ["in_progress", "pending", "completed"] })
  status!: "in_progress" | "pending" | "completed";

  @Column({ type: "timestamp", nullable: true })
  paymentDate?: Date;

  @ManyToOne(() => User, (user) => user.works)
  user!: User;

  @ManyToOne(() => Task, (task) => task.works)
  task!: Task;
}
