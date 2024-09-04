import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { OrmFamily } from "./Family";
import { OrmTaskDetail } from "./TaskDetail";
import { OrmWork } from "./Work";

@Entity()
export class OrmTask extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @ManyToOne(() => OrmFamily, (family) => family.tasks)
  family!: OrmFamily;

  @OneToMany(() => OrmTaskDetail, (taskDetail) => taskDetail.task)
  taskDetails!: OrmTaskDetail[];

  @OneToMany(() => OrmWork, (work) => work.task)
  works!: OrmWork[];
}
