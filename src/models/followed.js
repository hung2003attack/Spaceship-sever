'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class followed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  followed.init({
    id: DataTypes.INTEGER,
    id_user: DataTypes.STRING,
    id_follow: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'followed',
  });
  return followed;
};