import bcrypt from "bcrypt";

export class Password {
  private value: string;
  private isHashed: boolean;

  constructor(value: string, isHashed = false) {
    this.value = value;
    this.isHashed = isHashed;
  }

  async hash(): Promise<void> {
    if (!this.isHashed) {
      this.value = await bcrypt.hash(this.value, 10);
      this.isHashed = true;
    }
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
}
