import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import {
  validateSync,
} from "class-validator";

// Associations Entity
import { Family } from "@/domain/entities/Family";
import { User } from "@/domain/entities/User";

import { AppError } from "@/infrastructure/errors/AppError";

@Entity()
export class FamilyInvitationToken {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @Column()
  email: string;  // 招待されるメールアドレス

  @Column({
    type: "enum",
    enum: ["Parent", "Child"],
  })
  role: "Parent" | "Child";  // 招待されるロール

  @Column()
  familyId: number;  // 招待する家族ID

  @ManyToOne(() => Family)
  @JoinColumn({ name: "familyId" })
  family!: Family;

  @Column()
  inviterId: number;  // 招待者のユーザーID

  @ManyToOne(() => User)
  @JoinColumn({ name: "inviterId" })
  inviter!: User;

  constructor(
    token: string,
    expiresAt: Date,
    email: string,
    role: "Parent" | "Child",
    familyId: number,
    inviterId: number
  ) {
    this.token = token;
    this.expiresAt = expiresAt;
    this.email = email;
    this.role = role;
    this.familyId = familyId;
    this.inviterId = inviterId;
  }

  validate(): void {
    const errors = validateSync(this);
    if (errors.length > 0) {
      const validationMessages = errors
        .map((err) => Object.values(err.constraints!))
        .flat();
      throw new AppError("ValidationError", validationMessages.join(", "));
    }
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
