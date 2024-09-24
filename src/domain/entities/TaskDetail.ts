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

  getId(): number | undefined {
    return this.id;
  }

  getCustomDescription(): string {
    return this.custom_description;
  }

  getCustomReward(): number {
    return this.custom_reward;
  }

  getUserId(): number {
    return this.userId;
  }

  getTaskId(): number {
    return this.taskId;
  }

  setId(id: number): void {
    this.id = id;
  }

  setCustomDescription(custom_description: string): void {
    this.custom_description = custom_description;
  }

  setCustomReward(custom_reward: number): void {
    this.custom_reward = custom_reward;
  }

  setUserId(userId: number): void {
    this.userId = userId;
  }

  setTaskId(taskId: number): void {
    this.taskId = taskId;
  }
}
