'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
  });

  User.associate = function(models) {
    User.hasMany(models.Contact, {
      foreignKey: 'userId',
      as: 'contacts'
    });
  };

  return User;
};
