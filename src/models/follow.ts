'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: { STRING: any; INTEGER: any; DATE: any }) => {
    class follows extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            follows.belongsTo(models.users, { foreignKey: 'id_following', targetKey: 'id' });
            follows.belongsTo(models.users, { foreignKey: 'id_followed', targetKey: 'id' });
        }
    }
    follows.init(
        {
            id_following: DataTypes.STRING,
            id_followed: DataTypes.STRING,
            flwing: DataTypes.INTEGER,
            flwed: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'follows',
        },
    );
    return follows;
};
