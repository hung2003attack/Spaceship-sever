'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: { INTEGER: any; STRING: any }) => {
    class relatives extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
            relatives.belongsTo(models.users, { foreignKey: 'id_user', targetKey: 'id' });
            relatives.belongsTo(models.users, { foreignKey: 'id_relative', targetKey: 'id' });
        }
    }
    relatives.init(
        {
            id_user: DataTypes.STRING,
            id_relative: DataTypes.STRING,
            title: DataTypes.STRING,
            really: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'relatives',
        },
    );
    return relatives;
};
