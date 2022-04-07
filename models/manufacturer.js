"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Manufacturer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Manufacturer.hasMany(models.Leftover, {
        foreignKey: "manufacturer_id",
        as: "leftovers",
      });
      Manufacturer.hasMany(models.Product, {
        foreignKey: "manufacturer_id",
        as: "products",
      });
      Manufacturer.hasMany(models.Order, {
        foreignKey: "manufacturer_id",
        as: "orders",
      });
    }
  }
  Manufacturer.init(
    {
      firstName: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      factoryName: DataTypes.STRING,
      cnic: DataTypes.STRING,
      ntn_no: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Manufacturer",
    }
  );
  return Manufacturer;
};
