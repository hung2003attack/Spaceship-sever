'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: { INTEGER: any; STRING: any }) => {
    class relative extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
        }
    }
    relative.init(
        {
            id_user: DataTypes.STRING,
            id_relative: DataTypes.STRING,
            title: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'relative',
        },
    );
    return relative;
};
