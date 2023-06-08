'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize: any, DataTypes: { STRING: any; INTEGER: any; DATE: any }) => {
    class mores extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            mores.belongsTo(models.users, { foreignKey: 'id_user', targetKey: 'id' });
        }
    }
    mores.init(
        {
            id_user: DataTypes.STRING,
            position: DataTypes.STRING,
            love: DataTypes.INTEGER,
            star: DataTypes.INTEGER,
            visit: DataTypes.INTEGER,
            follow: DataTypes.INTEGER,
            following: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'mores',
        },
    );
    return mores;
};
