import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Family } from "./Family";
import { TaskDetail } from "./TaskDetail";
import { Work } from "./Work";

@Entity()
export class Task extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @ManyToOne(() => Family, (family) => family.tasks)
  family!: Family;

  @OneToMany(() => TaskDetail, (taskDetail) => taskDetail.task)
  taskDetails!: TaskDetail[];

  @OneToMany(() => Work, (work) => work.task)
  works!: Work[];
}
