'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    timezone: DataTypes.STRING,
  });

  Contact.associate = function(models) {
    Contact.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Contact;
};
