/* eslint import/no-cycle: 0 */

import { Sequelize, DataTypes, Model } from "sequelize";
import { DatabaseModel } from "../types/db";
import { UserModel } from "./user";
import { ExerciseModel } from "./exercise";

export class CompletedExcerciseModel extends DatabaseModel {
    id: number;
    duration: number;

    excerise: ExerciseModel;
    user: UserModel;
}

export default (sequelize: Sequelize) => {
    CompletedExcerciseModel.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            duration: {
                type: DataTypes.INTEGER,
            },
        },
        {
            paranoid: true,
            timestamps: true,
            sequelize,
            modelName: "completedExcercise",
        }
    );

    CompletedExcerciseModel.associate = (models) => {
        (CompletedExcerciseModel as any).belongsTo(models.Exercise, {
            foreignKey: {
                name: "exerciseID",
                allowNull: false,
            },
        });
        (CompletedExcerciseModel as any).belongsTo(models.User, {
            foreignKey: {
                name: "userID",
                allowNull: false,
            },
        });
    };

    return CompletedExcerciseModel;
};
