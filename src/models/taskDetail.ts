import { Sequelize, DataTypes, Model, Optional } from "sequelize";

// TaskDetail attributes interface
interface TaskDetailAttributes {
  id: string;
  taskId: string;
  userId: string;
  amount: number;
}

// Optional attributes for creation
interface TaskDetailCreationAttributes
  extends Optional<TaskDetailAttributes, "id"> {}

export class TaskDetail
  extends Model<TaskDetailAttributes, TaskDetailCreationAttributes>
  implements TaskDetailAttributes
{
  public id!: string;
  public taskId!: string;
  public userId!: string;
  public amount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof TaskDetail {
    TaskDetail.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        taskId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "task_id",
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "user_id",
        },
        amount: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "task_details",
        timestamps: true,
      }
    );

    return TaskDetail;
  }

  static associate(db: any) {
    db.TaskDetail.belongsTo(db.Task, { foreignKey: "taskId", as: "task" });
    db.TaskDetail.belongsTo(db.User, { foreignKey: "userId", as: "user" });
  }
}
