import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { User } from "@/domain/entities/User";
import { Task } from "@/domain/entities/Task";

@Entity()
export class Family {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  payment_schedule: string;

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

  constructor(name: string, payment_schedule: string) {
    this.name = name;
    this.payment_schedule = payment_schedule;
  }
}
