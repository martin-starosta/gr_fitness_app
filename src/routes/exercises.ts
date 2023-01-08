import { Router, Request, Response, NextFunction } from "express";
import { body, query } from "express-validator";
import { Op } from "sequelize";

import { models } from "../db";
import { verifyJWT, verifyRole } from "../middlewares/authorization";

const router: Router = Router();

const { Exercise, Program, ComletedExercise } = models;
import { EXERCISE_DIFFICULTY, ROLE, ORDER_DIRECTION } from "../utils/enums";
import { validateParameters } from "../utils/validateParameters";
import { validateEnumValue } from "../utils/valideEnumValue";

import { ExerciseListQueryParams } from "../types";

const validateProgramID = async (programID: number): Promise<boolean> => {
    const program = await Program.findByPk(programID);
    if (!program) {
        throw new Error("Invalid programID. Program does not exist");
    }
    return true;
};

const validateDataExists = async (id: number, model: any): Promise<boolean> => {
    const data = await model.findByPk(id);
    if (!data) {
        throw new Error("Invalid ID. Value does not exist");
    }
    return true;
};

export default () => {
    router.get(
        "/",
        query("programID").optional().isInt(),
        query("limit").optional().isInt(),
        query("page").optional().isInt(),
        query("orderBy").optional().isString(),
        query("orderDirection")
            .optional()
            .custom((orderDirection: string) =>
                validateEnumValue(
                    orderDirection,
                    ORDER_DIRECTION,
                    "orderDirection"
                )
            ),
        async (_req: Request, res: Response, _next: NextFunction) => {
            if (!validateParameters(_req, res)) {
                return;
            }
            const {
                programID,
                search,
                limit: queryLimit,
                page,
                orderBy,
                orderDirection,
            }: ExerciseListQueryParams = _req.query;

            const offset = page ? (page - 1) * queryLimit : 0;
            const direction = orderDirection || ORDER_DIRECTION.ASC;

            const exercises = await Exercise.findAll({
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
                ...(queryLimit && { limit: queryLimit }),
                ...(page && { offset }),
                ...(orderBy && { order: [[orderBy, direction]] }),
            });

            return res.json({
                data: exercises,
                message: "List of exercises",
            });
        }
    );

    router.post(
        "/track",
        verifyJWT,
        body("duration").isInt(),
        body("exerciseID")
            .isInt()
            .custom((exerciseID: number) =>
                validateDataExists(exerciseID, Exercise)
            ),
        async (_req: Request, res: Response) => {
            if (!validateParameters(_req, res)) {
                return;
            }

            const { userId, exerciseID, duration } = _req.body;

            const completedExercise = await ComletedExercise.create({
                userID: userId,
                exerciseID,
                duration,
            });

            return res.json({
                data: completedExercise,
                message: "Exercise tracked",
            });
        }
    );

    router.delete(
        "/track/:id",
        verifyJWT,
        async (_req: Request, res: Response) => {
            const { id } = _req.params;
            const { userId } = _req.body;

            const completedExercise = await ComletedExercise.findOne({
                where: {
                    id,
                    userID: userId,
                },
            });

            if (!completedExercise) {
                return res.status(404).json({
                    data: [],
                    message: "Exercise not found",
                });
            }

            await completedExercise.destroy();

            return res.json({
                data: [],
                message: "Exercise deleted",
            });
        }
    );

    router.put(
        "/",
        verifyRole(ROLE.ADMIN),
        body("name").isString(),
        body("programID")
            .isInt()
            .custom((programID: number) => validateProgramID(programID)),
        body("difficulty").custom((difficulty) =>
            validateEnumValue(difficulty, EXERCISE_DIFFICULTY, "difficulty")
        ),
        async (_req: Request, res: Response, _next: NextFunction) => {
            if (!validateParameters(_req, res)) {
                return;
            }

            const { name, programID, difficulty } = _req.body;

            const exercise = await Exercise.create({
                name,
                programID,
                difficulty,
            });

            return res.json({
                data: exercise,
                message: "Exercise created",
            });
        }
    );

    router.post(
        "/:id",
        verifyRole(ROLE.ADMIN),
        body("name").optional().isString(),
        body("programID")
            .optional()
            .isInt()
            .custom((programID: number) => validateProgramID(programID)),
        body("difficulty")
            .optional()
            .custom((difficulty) =>
                validateEnumValue(difficulty, EXERCISE_DIFFICULTY, "difficulty")
            ),
        async (_req: Request, res: Response) => {
            if (!validateParameters(_req, res)) {
                return;
            }

            const { id } = _req.params;

            const exercise = await Exercise.findByPk(id);
            if (!exercise) {
                return res.status(404).json({
                    data: [],
                    message: "Exercise not found",
                });
            }

            const { name, programID, difficulty } = _req.body;

            await exercise.update({
                name: name || exercise.name,
                programID: programID || exercise.programID,
                difficulty: difficulty || exercise.difficulty,
            });

            return res.json({
                data: exercise,
                message: "Exercise updated",
            });
        }
    );

    router.delete(
        "/:id",
        verifyRole(ROLE.ADMIN),
        async (_req: Request, res: Response) => {
            const { id } = _req.params;

            const exercise = await Exercise.findByPk(id);
            if (!exercise) {
                return res.status(404).json({
                    data: [],
                    message: "Exercise not found",
                });
            }

            await exercise.destroy();

            return res.json({
                data: [],
                message: "Exercise deleted",
            });
        }
    );

    return router;
};
