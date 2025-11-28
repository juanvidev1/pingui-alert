import { sequelize } from './config.ts';
import { DataTypes } from 'sequelize';

import { Model, Optional } from 'sequelize';

export interface UserAttributes {
  id: number;
  username: string;
  chatId: number;
  secret: string;
  password?: string;
  alertsRemaining: number;
  registeredAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare username: string;
  declare chatId: number;
  declare secret: string;
  declare password?: string;
  declare alertsRemaining: number;
  declare registeredAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    alertsRemaining: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    },
    registeredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'User'
  }
);
