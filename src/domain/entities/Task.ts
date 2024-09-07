class Task {
  constructor(
    private id: number | null,
    private family_id: number,
    private name: string,
    private description: string,
    private reward: number,
  ) {
    this.id = id;
    this.family_id = family_id;
    this.name = name;
    this.description = description;
    this.reward = reward;
  }

  getId(): number | null {
    return this.id;
  }

  getFamilyId(): number {
    return this.family_id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getReward(): number {
    return this.reward;
  }

  setId(id: number): void {
    this.id = id;
  }

  setFamilyId(family_id: number): void {
    this.family_id = family_id;
  }

  setName(name: string): void {
    this.name = name;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  setReward(reward: number): void {
    this.reward = reward;
  }
}
