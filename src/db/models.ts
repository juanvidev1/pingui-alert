import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const Integration = sequelize.define('Integration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tokenHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scope: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rateLimit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'revoked', 'pending'),
    allowNull: false,
    defaultValue: 'pending'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

Integration.sync({ alter: true });

export { Integration };
