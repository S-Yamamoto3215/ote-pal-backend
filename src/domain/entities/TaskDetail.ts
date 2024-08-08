import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class TaskDetail extends BaseEntity {
  @Column("int")
  amount!: number;

  @ManyToOne(() => User, (user) => user.taskDetails)
  user!: User;

  @ManyToOne(() => Task, (task) => task.taskDetails)
  task!: Task;
}
