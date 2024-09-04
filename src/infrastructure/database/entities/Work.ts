import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { OrmUser } from "./User";
import { OrmTask } from "./Task";

@Entity()
export class OrmWork extends BaseEntity {
  @Column({ type: "enum", enum: ["in_progress", "pending", "completed"] })
  status!: "in_progress" | "pending" | "completed";

  @Column({ type: "timestamp", nullable: true })
  paymentDate?: Date;

  @ManyToOne(() => OrmUser, (user) => user.works)
  user!: OrmUser;

  @ManyToOne(() => OrmTask, (task) => task.works)
  task!: OrmTask;
}
