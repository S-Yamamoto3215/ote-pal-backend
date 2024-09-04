import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { OrmUser } from "./User";
import { OrmTask } from "./Task";

@Entity()
export class OrmTaskDetail extends BaseEntity {
  @Column("int")
  amount!: number;

  @ManyToOne(() => OrmUser, (user) => user.taskDetails)
  user!: OrmUser;

  @ManyToOne(() => OrmTask, (task) => task.taskDetails)
  task!: OrmTask;
}
