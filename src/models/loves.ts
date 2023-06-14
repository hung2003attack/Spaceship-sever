'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize: any, DataTypes: { STRING: any; INTEGER: any; DATE: any }) => {
    class loves extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {}
    }
    loves.init(
        {
            id_user: DataTypes.STRING,
            id_loved: DataTypes.STRING,
            createdAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'loves',
        },
    );
    return loves;
};
