'use strict';
module.exports = (sequelize, DataTypes) => {
  const upload_images = sequelize.define('upload_images', {
    file_path: {
      type: DataTypes.BLOB('long'),
      allowNull: false
    },
    size: {
      type : DataTypes.DOUBLE,
      allowNull : false,
    },
    writer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    }
  });
  return upload_images;
};