import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

import { models } from "../db";
const { User } = models;

import { hashPassword } from "../utils/password";
import { ROLE } from "../utils/enums";

const router: Router = Router();

export default () => {
    router.put(
        "/signup",
        body("email").isEmail(),
        body("password").isLength({ min: 1 }),
        body("age").optional().isInt(),
        body("role")
            .optional()
            .custom((value, { req }) => {
                if (!Object.values(ROLE).includes(value)) {
                    throw new Error(
                        "Invalid role. Valid roles are: " + Object.values(ROLE)
                    );
                }
                return true;
            }),
        async (_req: Request, res: Response, _next: NextFunction) => {
            const errors = validationResult(_req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    data: errors.array(),
                    message: "Invalid parameters",
                });
            }

            const { email, password, name, surname, nickName, role, age } =
                _req.body;

            const user = await User.findOne({
                where: {
                    email,
                },
            });
            if (user) {
                return res.status(400).json({
                    data: [],
                    message: "User already registered",
                });
            }

            const hash = await hashPassword(password);
            try {
                const createdUser = await User.create({
                    email,
                    password: hash,
                    name,
                    surname,
                    nickName,
                    role: role || ROLE.USER,
                    age,
                });

                return res.json({
                    data: [createdUser],
                    message: "User registered successfully",
                });
            } catch (e) {
                return res.status(500).json({
                    data: [],
                    message: "Something went wrong",
                });
            }
        }
    );

    return router;
};
