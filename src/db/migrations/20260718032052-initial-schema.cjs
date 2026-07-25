'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('integrations', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      chatId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },

      tokenHash: {
        type: Sequelize.STRING,
        allowNull: false
      },

      scope: {
        type: Sequelize.STRING,
        allowNull: false
      },

      rateLimit: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM('active', 'revoked', 'pending'),
        allowNull: false,
        defaultValue: 'pending'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('integrations', ['tokenHash'], {
      unique: true,
      name: 'idx_integrations_token_hash'
    });

    await queryInterface.addIndex('integrations', ['chatId'], {
      name: 'idx_integrations_chat_id'
    });

    await queryInterface.createTable('metrics_daily', {
      date: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },

      totalIntegrations: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      totalSentAlerts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      totalErrors: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('metrics_daily');

    await queryInterface.removeIndex('integrations', 'idx_integrations_chat_id');

    await queryInterface.removeIndex('integrations', 'idx_integrations_token_hash');

    await queryInterface.dropTable('integrations');

    // PostgreSQL deja el tipo ENUM creado aunque se elimine la tabla.
    // SQLite simplemente ignorará este bloque.
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_integrations_status";');
    }
  }
};
