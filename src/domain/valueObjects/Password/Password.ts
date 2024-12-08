import { validateSync, IsNotEmpty, Length } from "class-validator";
import bcrypt from "bcrypt";

export class Password {
  @IsNotEmpty({ message: "Password is required" })
  @Length(6, 20, { message: "Password must be between 6 and 20" })
  private value: string;
  private isHashed: boolean;

  constructor(password: string, isHashed: boolean = false) {
    this.value = password;
    this.isHashed = isHashed;

    if (!this.isHashed) {
      this.validate();
      this.value = this.hashPassword(password);
      this.isHashed = true;
    }
  }

  private hashPassword(plainPassword: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(plainPassword, saltRounds);
  }

  async compare(plainPassword: string): Promise<boolean> {
    if (!this.isHashed) {
      throw new Error("Cannot compare a non-hashed password");
    }
    return await bcrypt.compare(plainPassword, this.value);
  }

  static fromHashed(value: string): Password {
    return new Password(value, true);
  }

  getValue(): string {
    return this.value;
  }

  getIsHashed(): boolean {
    return this.isHashed;
  }

  private validate(): void {
    const errors = validateSync(this);
    if (errors.length > 0) {
      const validationMessages = errors
        .map((err) => Object.values(err.constraints!))
        .flat();
      throw new Error(validationMessages.join(", "));
    }
  }
}
