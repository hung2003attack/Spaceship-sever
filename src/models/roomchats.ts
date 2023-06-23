'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: { STRING: any; DATE: any }) => {
    class roomChats extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
        }
    }
    roomChats.init(
        {
            id_user: DataTypes.STRING,
            id_room: DataTypes.STRING,
            createdAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'roomChats',
        },
    );
    return roomChats;
};
