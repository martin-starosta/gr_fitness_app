/* eslint import/no-cycle: 0 */
import { ROLE } from "../utils/enums";
import { Sequelize, DataTypes } from "sequelize";
import { DatabaseModel } from "../types/db";

export class UserModel extends DatabaseModel {
    id: number;
    name: string;
    surname: string;
    nickName: string;
    email: string;
    password: string;
    age: number;
    role: ROLE;
}

export default (sequelize: Sequelize) => {
    UserModel.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100),
            },
            surname: {
                type: DataTypes.STRING(100),
            },
            nickName: {
                type: DataTypes.STRING(200),
            },
            email: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            age: {
                type: DataTypes.INTEGER,
            },
            role: {
                type: DataTypes.STRING(200),
            },
        },
        {
            paranoid: true,
            timestamps: true,
            sequelize,
            modelName: "user",
        }
    );

    return UserModel;
};
