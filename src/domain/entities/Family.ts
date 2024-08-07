import {
  Entity,
  Column,
} from "typeorm";

import { BaseEntity } from "./BaseEntity";

@Entity()
export class Family extends BaseEntity {
  @Column()
  name!: string;

  @Column("int")
  paymentDay!: number;
}
