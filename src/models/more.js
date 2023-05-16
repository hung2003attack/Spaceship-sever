'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class more extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  more.init({
    id: DataTypes.INTEGER,
    id_user: DataTypes.STRING,
    position: DataTypes.STRING,
    love: DataTypes.INTEGER,
    star: DataTypes.INTEGER,
    visit: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'more',
  });
  return more;
};