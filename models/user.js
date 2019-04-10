'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {

    // Email
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      primaryKey: true
    },
    // Name
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Password
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Salt
    salt: {
      type: DataTypes.STRING
    },
    // Introduce 
    introduce: {
      type: DataTypes.STRING
    },
    // Profile Image
    profile_img: {
      type: DataTypes.STRING
    },
    // contents_cnt
    contents_cnt: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // follower_cnt
    follower_cnt: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // following_cnt
    following_cnt: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });
  
  return user;
};