import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Family } from "./Family";
import { Work } from "./Work";
import { TaskDetail } from "./TaskDetail";

import { IsEnum, IsEmail, IsNotEmpty, IsString } from "class-validator";

@Entity()
export class User extends BaseEntity {
  @Column()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Column()
  @IsNotEmpty()
  password!: string;

  @Column()
  @IsNotEmpty()
  @IsEnum(["parent", "child"])
  role!: "parent" | "child";

  @Column({ default: true })
  isActive: boolean = true;

  @ManyToOne(() => Family, (family) => family.users)
  family!: Family;

  @OneToMany(() => Work, (work) => work.user)
  works!: Work[];

  @OneToMany(() => TaskDetail, (taskDetail) => taskDetail.user)
  taskDetails!: TaskDetail[];
}
