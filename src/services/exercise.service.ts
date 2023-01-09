import { Op } from "sequelize";
import { ORDER_DIRECTION } from "../utils/enums";

import { models } from "../db";
const { Exercise, Program, ComletedExercise } = models;
import {
    ExerciseListQueryParams,
    TCompletedExercise,
    TExercise,
} from "../types";

export async function listExercises({
    page,
    limit,
    orderBy,
    orderDirection,
    programID,
    search,
}: ExerciseListQueryParams) {
    const offset = page ? (page - 1) * limit : 0;
    const direction = orderDirection || ORDER_DIRECTION.ASC;

    return await Exercise.findAll({
        include: [
            {
                model: Program,
                as: "program",
            },
        ],
        where: {
            ...(programID && { programID: programID }),
            ...(search && {
                name: {
                    [Op.like]: `%${search}%`,
                },
            }),
        },
        ...(limit && { limit: limit }),
        ...(page && { offset }),
        ...(orderBy && { order: [[orderBy, direction]] }),
    });
}

export async function trackExercise({
    userId,
    exerciseID,
    duration,
}: TCompletedExercise) {
    return await ComletedExercise.create({
        userID: userId,
        exerciseID,
        duration,
    });
}

export async function removeCompletedExercises(id: number, userId: number) {
    const completedExercise = await ComletedExercise.findOne({
        where: {
            id,
            userID: userId,
        },
    });

    if (!completedExercise) {
        throw new Error("Exercise not found");
    }

    await completedExercise.destroy();
}

export async function removeExercise(id: number) {
    const exercise = await Exercise.findByPk(id);

    if (!exercise) {
        throw new Error(
            `Invalid ID[${id}]. Exercise does not exist. Not able to delete.`
        );
    }
    await exercise.destroy();
}

export async function updateExercise(updateExercise: TExercise) {
    const exercise = await Exercise.findByPk(updateExercise.id);
    if (!exercise) {
        throw new Error(
            `Invalid ID[${updateExercise.id}]. Exercise does not exist. Not able to update.`
        );
    }

    return await exercise.update({
        name: updateExercise.name || exercise.name,
        programID: updateExercise.programID || exercise.programID,
        difficulty: updateExercise.difficulty || exercise.difficulty,
    });
}

export async function createExercise(newExercise: TExercise) {
    return await Exercise.create({
        name: newExercise.name,
        programID: newExercise.programID,
        difficulty: newExercise.difficulty,
    });
}
