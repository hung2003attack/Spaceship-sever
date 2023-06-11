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
            user.hasOne(models.friends, { foreignKey: 'idCurrentUser', as: 'id_f_user' });
            user.hasOne(models.friends, { foreignKey: 'idFriend', as: 'id_friend' });
            user.hasOne(models.relatives, { foreignKey: 'id_user', as: 'id_r_user' });
            user.hasOne(models.relatives, { foreignKey: 'id_relative', as: 'id_relative' });
            user.hasOne(models.mores, { foreignKey: 'id_user', as: 'id_m_user' });
            user.hasOne(models.follows, { foreignKey: 'id_following', as: 'id_flwing' });
            user.hasOne(models.follows, { foreignKey: 'id_followed', as: 'id_flwed' });
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
            address: DataTypes.STRING,
            skill: DataTypes.STRING,
            birthday: DataTypes.STRING,
            occupation: DataTypes.STRING,
            experience: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            sn: DataTypes.STRING,
            l: DataTypes.STRING,
            w: DataTypes.STRING,
            as: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'users',
        },
    );
    return user;
};
