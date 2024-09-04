import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { OrmUser } from "./User";
import { OrmTask } from "./Task";

@Entity()
export class OrmFamily extends BaseEntity {
  @Column()
  name!: string;

  @Column("int")
  paymentDay!: number;

  @OneToMany(() => OrmUser, (user) => user.family)
  users!: OrmUser[];

  @OneToMany(() => OrmTask, (task) => task.family)
  tasks!: OrmTask[];
}
