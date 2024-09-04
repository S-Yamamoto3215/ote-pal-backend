import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { OrmFamily } from "./Family";
import { OrmWork } from "./Work";
import { OrmTaskDetail } from "./TaskDetail";

@Entity()
export class OrmUser extends BaseEntity {
  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: ["parent", "child"] })
  role!: "parent" | "child";

  @Column({ default: true })
  isActive: boolean = true;

  @ManyToOne(() => OrmFamily, (family) => family.users)
  family!: OrmFamily;

  @OneToMany(() => OrmWork, (work) => work.user)
  works!: OrmWork[];

  @OneToMany(() => OrmTaskDetail, (taskDetail) => taskDetail.user)
  taskDetails!: OrmTaskDetail[];
}
