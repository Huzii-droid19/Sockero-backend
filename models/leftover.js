"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Leftover extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Leftover.belongsTo(models.Manufacturer, {
        foreignKey: "manufacturer_id",
        as: "manufacturer",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Leftover.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      duration: DataTypes.DATE,
      image: DataTypes.STRING,
      category: DataTypes.STRING,
      manufacturer_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Leftover",
    }
  );
  return Leftover;
};
