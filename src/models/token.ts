'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize: any, DataTypes: { STRING: string; BOOLEAN: boolean }) => {
    class Token extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            // define association here
        }
    }
    Token.init(
        {
            accessToken: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'tokens',
        },
    );
    return Token;
};
