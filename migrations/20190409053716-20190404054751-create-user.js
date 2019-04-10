'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: { 
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        },
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      salt: {
        type: Sequelize.STRING
      },
    introduce: {
      type: Sequelize.STRING
    },
    profile_img: {
      type: Sequelize.STRING
    },
    contents_cnt: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    follower_cnt: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    following_cnt: {
      type: Sequelize.INTEGER,
      defaultValue: 0
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};