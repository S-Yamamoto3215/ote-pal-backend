import { Sequelize, DataTypes, Model, Optional } from "sequelize";

// Task attributes interface
interface TaskAttributes {
  id: string;
  familyId: string;
  title: string;
  description: string;
}

// Optional attributes for creation
interface TaskCreationAttributes extends Optional<TaskAttributes, "id"> {}

export class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  public id!: string;
  public familyId!: string;
  public title!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Task {
    Task.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        familyId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "family_id",
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "tasks",
        timestamps: true,
      }
    );

    return Task;
  }

  static associate(db: any) {
    db.Task.belongsTo(db.Family, { foreignKey: "familyId", as: "family" });
    db.Task.hasMany(db.TaskDetail, { foreignKey: "taskId", as: "taskDetails" });
    db.Task.hasMany(db.work, { foreignKey: "taskId", as: "works" });
  }
}
