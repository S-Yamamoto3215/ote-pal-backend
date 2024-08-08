import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from './User';
import { Task } from "./Task";

@Entity()
export class Family extends BaseEntity {
  @Column()
  name!: string;

  @Column("int")
  paymentDay!: number;

  @OneToMany(() => User, (user) => user.family)
  users!: User[];

  @OneToMany(() => Task, (task) => task.family)
  tasks!: Task[];
}
