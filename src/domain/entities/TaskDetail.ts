import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import { User } from "@/domain/entities/User";
import { Task } from "@/domain/entities/Task";

@Entity()
export class TaskDetail {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    nullable: true,
  })
  custom_description: string;

  @Column({
    nullable: true,
  })
  custom_reward: number;

  @Column()
  userId!: number;
  @ManyToOne(() => User, (user) => user.taskDetails)
  readonly user!: User;

  @Column()
  taskId!: number;
  @ManyToOne(() => Task, (task) => task.taskDetails)
  readonly task!: Task;

  constructor(
    custom_description: string,
    custom_reward: number,
    userId: number,
    taskId: number,
  ) {
    this.custom_description = custom_description;
    this.custom_reward = custom_reward;
    this.userId = userId;
    this.taskId = taskId;
  }
}
