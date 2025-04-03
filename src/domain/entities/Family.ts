import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { User } from "@/domain/entities/User";
import { Task } from "@/domain/entities/Task";

@Entity()
export class Family {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({
    type: "smallint",
    default: 1,
  })
  payment_schedule: number;

  @OneToMany(() => User, (user) => user.family, {
    createForeignKeyConstraints: false,
    persistence: false,
  })
  readonly users?: User[];

  @OneToMany(() => Task, (task) => task.family, {
    createForeignKeyConstraints: false,
    persistence: false,
  })
  readonly tasks?: Task[];

  constructor(name: string, payment_schedule: number) {
    this.name = name;
    this.payment_schedule = payment_schedule;
  }
}
