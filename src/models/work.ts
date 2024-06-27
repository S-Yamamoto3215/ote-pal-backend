import { Sequelize, DataTypes, Model, Optional } from "sequelize";

// Work attributes interface
interface WorkAttributes {
  id: string;
  userId: string;
  taskId: string;
  status: WorkStatus;
  paymentDate?: Date;
}

// Optional attributes for creation
interface WorkCreationAttributes
  extends Optional<WorkAttributes, "id" | "paymentDate"> {}

export enum WorkStatus {
  InProgress = "in_progress",
  Pending = "pending",
  Completed = "completed",
}

export class Work
  extends Model<WorkAttributes, WorkCreationAttributes>
  implements WorkAttributes
{
  public id!: string;
  public userId!: string;
  public taskId!: string;
  public status!: WorkStatus;
  public paymentDate?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Work {
    Work.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "user_id",
        },
        taskId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "task_id",
        },
        status: {
          type: DataTypes.ENUM("in_progress", "pending", "completed"),
          allowNull: false,
        },
        paymentDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: "payment_date",
        },
      },
      {
        sequelize,
        tableName: "works",
        timestamps: true,
      }
    );

    return Work;
  }

  static associate(db: any) {
    db.Work.belongsTo(db.User, { foreignKey: "userId", as: "user" });
    db.Work.belongsTo(db.Task, { foreignKey: "taskId", as: "task" });
  }
}
