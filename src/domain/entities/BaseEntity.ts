import { v4 as uuidv4 } from "uuid";

export abstract class BaseEntity {
  private id: string;

  constructor(id?: string) {
    this.id = id || uuidv4();
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    if (this.id) {
      throw new Error("Cannot change id");
    }
    this.id = id;
  }
}
