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
      type: DataTypes.BIGINT,
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
    deliveryMode: {
      type: DataTypes.STRING(100), // Changed from ENUM to STRING for compatibility
      allowNull: false,
      defaultValue: 'PERSONAL',
      validate: {
        isIn: [['PERSONAL', 'CHANNEL']]
      }
    }
  },
  {
    tableName: 'integrations',
    timestamps: true
  }
);

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

const IntegrationMember = sequelize.define(
  'IntegrationMember',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    integrationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Integration,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    chatId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    ownerChatId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Denormalized owner identifier used to efficiently query members without requiring the integrationId.'
    },
    activeMember: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'integration_members',
    timestamps: true
  }
);

Integration.hasMany(IntegrationMember, { foreignKey: 'integrationId', as: 'members' });
IntegrationMember.belongsTo(Integration, { foreignKey: 'integrationId' });

const IntegrationInvite = sequelize.define(
  'IntegrationInvite',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    integrationId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'integrations',
        key: 'id'
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    createdByChatId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    maxUses: {
      type: DataTypes.INTEGER
    },
    uses: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'revoked'),
      defaultValue: 'active'
    }
  },
  {
    tableName: 'integration_invites',
    timestamps: true
  }
);

Integration.hasMany(IntegrationInvite, { foreignKey: 'integrationId', as: 'invites' });
IntegrationInvite.belongsTo(Integration, { foreignKey: 'integrationId', as: 'integration' });

export { Metrics, Integration, IntegrationMember, IntegrationInvite };
