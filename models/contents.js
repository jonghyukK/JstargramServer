'use strict';
module.exports = (sequelize, DataTypes) => {
  const contents = sequelize.define('contents', {

    // content ID
    contents_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // Image Path
    image_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Content
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Writer
    writer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Writer Profile
    writer_profile : {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Favorite Count
    favorite_cnt: {
      type : DataTypes.INTEGER,
      defaultValue : 0
    },
    // Comment Count
    comment_cnt: {
      type : DataTypes.INTEGER,
      defaultValue : 0
    }
  });

  return contents;
};