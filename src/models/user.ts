'use strict';

const { Model } = require('sequelize');
module.exports = (
    sequelize: any,
    DataTypes: {
        [x: string]: any;
        STRING: string;
        BOOLEAN: boolean;
    },
) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
        }
    }
    user.init(
        {
            fullName: DataTypes.STRING,
            nickName: DataTypes.STRING,
            status: DataTypes.STRING,
            password: DataTypes.STRING,
            phoneNumberEmail: DataTypes.STRING,
            gender: DataTypes.STRING,
            background: DataTypes.STRING,
            avatar: DataTypes.STRING,
            admin: DataTypes.BOOLEAN,
            hobby: DataTypes.STRING,
            strengths: DataTypes.STRING,
            adress: DataTypes.STRING,
            skill: DataTypes.STRING,
            birthDate: DataTypes.STRING,
            occupation: DataTypes.STRING,
            experience: DataTypes.STRING,
            createdAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'users',
        },
    );
    return user;
};
