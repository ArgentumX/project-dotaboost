'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'balance', {type: Sequelize.DataTypes.FLOAT, defaultValue: 0.0});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'balance')
  }
};
