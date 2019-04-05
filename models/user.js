'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {

    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING
    }
  });
  
  return user;
};