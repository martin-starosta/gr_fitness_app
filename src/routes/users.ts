import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { verifyJWT, verifyRole } from "../middlewares/authorization";
import { models } from "../db";

const router: Router = Router();

const { User, ComletedExercise, Exercise } = models;
import { ROLE } from "../utils/enums";
import { validateParameters } from "../utils/validateParameters";

import { UserRequestParams } from "../types";

const PUBLIC_USER_ATTRIBUTES = ["id", "nickName"];
const ADMIN_USER_ATTRIBUTES = [
    "id",
    "nickName",
    "role",
    "name",
    "email",
    "surname",
];

export default () => {
    router.get(
        "/",
        verifyJWT,
        async (_req: Request, res: Response, _next: NextFunction) => {
            let users = [];
            const { userRole } = _req.body;
            switch (userRole) {
                case ROLE.ADMIN:
                    users = await User.findAll({
                        attributes: ADMIN_USER_ATTRIBUTES,
                    });
                    break;
                case ROLE.USER:
                default:
                    users = await User.findAll({
                        attributes: PUBLIC_USER_ATTRIBUTES,
                    });
            }

            return res.json({
                data: users,
                message: "List of users",
            });
        }
    );

    router.get("/:id", verifyJWT, async (_req: Request, res: Response) => {
        const { id } = _req.params;
        const { userRole, userId }: Partial<UserRequestParams> = _req.body;

        if (userRole !== ROLE.ADMIN && userId !== id) {
            return res.status(401).send({
                data: [],
                message: "You don't have permission to access this route",
            });
        }

        const user = await User.findOne({
            where: { id },
            attributes: ADMIN_USER_ATTRIBUTES,
            raw: true,
        });

        const userCompletedExercises = await ComletedExercise.findAll({
            where: { userID: id },
            attributes: [
                "id",
                "exercise.name",
                "exercise.createdAt",
                "duration",
            ],
            include: [{ model: Exercise, attributes: [] }],
            raw: true,
        });

        return res.json({
            data: {
                ...user,
                completedExercises: userCompletedExercises,
            },
            message: "User details",
        });
    });

    router.post(
        "/:id",
        body("age").optional().isInt(),
        verifyRole(ROLE.ADMIN),
        async (_req: Request, res: Response) => {
            if (!validateParameters(_req, res)) {
                return;
            }
            const { id } = _req.params;
            const {
                name,
                surname,
                nickName,
                role,
                age,
            }: Partial<UserRequestParams> = _req.body;

            const user = await User.findOne({
                where: { id },
                attributes: ADMIN_USER_ATTRIBUTES,
            });
            user.set({
                name: name || user.name,
                surname: surname || user.surname,
                nickName: nickName || user.nickName,
                role: role || user.role,
                age: age || user.age,
            });
            await user.save();

            return res.json({
                data: user,
                message: "User updated",
            });
        }
    );

    return router;
};
