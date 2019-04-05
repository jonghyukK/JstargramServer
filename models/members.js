'use strict';
module.exports = (sequelize, DataTypes) => {
  const members = sequelize.define('members', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  
  return members;
};