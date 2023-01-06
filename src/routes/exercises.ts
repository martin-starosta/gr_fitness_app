import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";

import { models } from "../db";
import { verifyRole } from "../middlewares/authorization";

const router: Router = Router();

const { Exercise, Program } = models;
import { EXERCISE_DIFFICULTY, ROLE } from "../utils/enums";
import { validateParameters } from "../utils/validateParameters";
import { validateEnumValue } from "../utils/valideEnumValue";

const validateProgramID = async (programID: number): Promise<boolean> => {
    const program = await Program.findByPk(programID);
    if (!program) {
        throw new Error("Invalid programID. Program does not exist");
    }
    return true;
};

export default () => {
    router.get(
        "/",
        async (_req: Request, res: Response, _next: NextFunction) => {
            const exercises = await Exercise.findAll({
                include: [
                    {
                        model: Program,
                        as: "program",
                    },
                ],
            });

            return res.json({
                data: exercises,
                message: "List of exercises",
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
