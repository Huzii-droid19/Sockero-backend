'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Request.init({
    buyer_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    asking_days: DataTypes.INTEGER,
    asking_price: DataTypes.INTEGER,
    manufacturer_id: DataTypes.INTEGER,
    offered_price: DataTypes.INTEGER,
    offered_duration: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Request',
    freezeTableName: true,
  });
  return Request;
};