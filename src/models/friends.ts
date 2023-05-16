'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize: any, DataTypes: { STRING: any; DATE: any }) => {
    class friends extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
        }
    }
    friends.init(
        {
            idCurrentUser: DataTypes.STRING,
            idFriend: DataTypes.STRING,
            id_message: DataTypes.STRING,
            createdAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'friends',
        },
    );
    return friends;
};
