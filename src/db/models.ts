import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const Integration = sequelize.define(
  'Integration',
  {
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
    }
  },
  {
    tableName: 'integrations',
    timestamps: true
  }
);

export { Integration };

const Metrics = sequelize.define(
  'MetricsDaily',
  {
    date: {
      type: DataTypes.STRING, // "YYYY-MM-DD"
      primaryKey: true
    },
    totalIntegrations: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalSentAlerts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalErrors: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: 'metrics_daily',
    timestamps: false
  }
);

export { Metrics };
