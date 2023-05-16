'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: { STRING: any; NUMBER: any; DATE: any }) => {
    class messages extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
        }
    }
    messages.init(
        {
            id_message: DataTypes.STRING,
            status: DataTypes.NUMBER,
            title: DataTypes.STRING,
            createdAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'messages',
        },
    );
    return messages;
};
