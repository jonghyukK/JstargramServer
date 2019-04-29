'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('contents', {
      
      // content ID
      contents_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      // Image Path
      image_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // Content
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Writer
      writer: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Writer Profile
      writer_profile : {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Favorite Count
      favorite_cnt: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // Comment Count
      comment_cnt: {
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
    return queryInterface.dropTable('contents');
  }
};