import { Request, Response, NextFunction } from "express";
import { validateParameters } from "../utils/validateParameters";
import { ExerciseListQueryParams } from "../types";

import {
    listExercises,
    trackExercise,
    removeExercise,
    updateExercise,
    createExercise,
    removeCompletedExercises,
} from "../services/exercise.service";
import { logger } from "../utils/logger";

export const list = async (
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        if (!validateParameters(_req, res)) {
            return;
        }
        const {
            programID,
            search,
            limit,
            page,
            orderBy,
            orderDirection,
        }: ExerciseListQueryParams = _req.query;

        const exercises = await listExercises({
            programID,
            search,
            limit,
            page,
            orderBy,
            orderDirection,
        });

        return res.json({
            data: exercises,
            message: "List of exercises",
        });
    } catch (error) {
        logger.error("Not able to retrieve exercises list");
        _next(error);
    }
};

export async function track(_req: Request, res: Response, _next: NextFunction) {
    try {
        if (!validateParameters(_req, res)) {
            return;
        }

        const { userId, exerciseID, duration } = _req.body;

        return res.json({
            data: await trackExercise({ userId, exerciseID, duration }),
            message: "Exercise tracked",
        });
    } catch (error) {
        logger.error("Not able to track exercise");
        _next(error);
    }
}

export async function removeCompletedExercise(
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    try {
        const { id } = _req.params;
        const { userId } = _req.body;

        await removeCompletedExercises(parseInt(id), parseInt(userId));

        return res.json({
            data: [],
            message: "Exercise deleted",
        });
    } catch (error) {
        logger.error("Not able to delete completed exercise.");
        _next(error);
    }
}

export async function remove(
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    try {
        const { id } = _req.params;

        await removeExercise(parseInt(id));

        return res.json({
            data: [],
            message: "Exercise deleted",
        });
    } catch (error) {
        logger.error("Not able to delete exercise");
        _next(error);
    }
}

export async function update(
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    try {
        if (!validateParameters(_req, res)) {
            return;
        }
        const { id } = _req.params;
        const { name, programID, difficulty } = _req.body;

        return res.json({
            data: await updateExercise({
                id: parseInt(id),
                name,
                programID,
                difficulty,
            }),
            message: "Exercise updated",
        });
    } catch (error) {
        logger.error("Not able to update exercise");
        _next(error);
    }
}

export async function create(
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    try {
        if (!validateParameters(_req, res)) {
            return;
        }
        const { name, programID, difficulty } = _req.body;
        return res.json({
            data: await createExercise({ name, programID, difficulty }),
            message: "Exercise created",
        });
    } catch (error) {
        logger.error("Not able to create exercise");
        _next(error);
    }
}
