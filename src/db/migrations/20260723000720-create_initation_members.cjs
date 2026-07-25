'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('integration_invites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      integrationId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'integrations',
          key: 'id'
        }
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdByChatId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      maxUses: {
        type: Sequelize.INTEGER
      },
      uses: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'revoked'),
        defaultValue: 'active'
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
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('integration_invites');
  }
};
