import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

import { sign } from "jsonwebtoken";

import { models } from "../db";
const { User } = models;

import { checkPassword, hashPassword } from "../utils/password";
import { ROLE } from "../utils/enums";

import { verifyJWT } from "../middlewares/authorization";

const router: Router = Router();

const validateParameters = (_req: Request, res: Response): boolean => {
    const errors = validationResult(_req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            data: errors.array(),
            message: "Invalid parameters",
        });

        return false;
    }

    return true;
};

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
            if (!validateParameters(_req, res)) {
                return;
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

    router.post(
        "/login",
        body("email").isEmail(),
        body("password").isLength({ min: 1 }),
        async (_req: Request, res: Response, _next: NextFunction) => {
            if (!validateParameters(_req, res)) {
                return;
            }

            const { email, password } = _req.body;

            const user = await User.findOne({
                where: {
                    email,
                },
            });
            if (!user) {
                return res.status(400).json({
                    data: [],
                    message: "User not found",
                });
            }
            if (!(await checkPassword(password, user.password))) {
                return res.status(401).json({
                    data: [],
                    message: "Invalid credentials",
                });
            }

            const token = sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN || 86400,
            });

            return res.json({
                data: { token },
                message: "User logged in successfully",
            });
        }
    );

    return router;
};
