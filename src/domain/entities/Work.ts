class Work {
  constructor(
    private id: number | null,
    private task_id: number,
    private user_id: number,
    private status: "In Progress" | "Completed" | "Approved" | "Rejected",
  ) {
    this.id = id;
    this.task_id = task_id;
    this.user_id = user_id;
    this.status = status;
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

  getStatus(): "In Progress" | "Completed" | "Approved" | "Rejected" {
    return this.status;
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

  setStatus(status: "In Progress" | "Completed" | "Approved" | "Rejected"): void {
    this.status = status;
  }
}
