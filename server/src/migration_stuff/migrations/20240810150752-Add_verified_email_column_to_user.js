'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'verifiedEmail', {type: Sequelize.DataTypes.STRING, defaultValue: false});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'verifiedEmail')
  }
};
