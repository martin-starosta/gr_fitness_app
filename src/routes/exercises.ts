import { Router } from "express";
import { body, query } from "express-validator";

import { models } from "../db";
import { verifyJWT, verifyRole } from "../middlewares/authorization.middleware";

const router: Router = Router();

const { Exercise, Program } = models;
import { EXERCISE_DIFFICULTY, ROLE, ORDER_DIRECTION } from "../utils/enums";
import { validateDataExists, validateEnumValue } from "../utils/validate";

import {
    list,
    track,
    remove,
    update,
    create,
    removeCompletedExercise,
} from "../controllers/exercise.controller";

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
        list
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
        track
    );

    router.delete("/track/:id", verifyJWT, removeCompletedExercise);

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
        create
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
        update
    );

    router.delete("/:id", verifyRole(ROLE.ADMIN), remove);

    return router;
};
