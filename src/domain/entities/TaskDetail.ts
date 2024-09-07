class TaskDetail {
  constructor(
    private id: number | null,
    private task_id: number,
    private user_id: number,
    private custom_description: string,
    private custom_reward: number,
  ) {
    this.id = id;
    this.task_id = task_id;
    this.user_id = user_id;
    this.custom_description = custom_description;
    this.custom_reward = custom_reward;
  }

  getId(): number | null {
    return this.id;
  }

  getTaskId(): number {
    return this.task_id;
  }

  getUserId(): number {
    return this.user_id;
  }

  getCustomDescription(): string {
    return this.custom_description;
  }

  getCustomReward(): number {
    return this.custom_reward;
  }

  setId(id: number): void {
    this.id = id;
  }

  setTaskId(task_id: number): void {
    this.task_id = task_id;
  }

  setUserId(user_id: number): void {
    this.user_id = user_id;
  }

  setCustomDescription(custom_description: string): void {
    this.custom_description = custom_description;
  }

  setCustomReward(custom_reward: number): void {
    this.custom_reward = custom_reward;
  }
}
