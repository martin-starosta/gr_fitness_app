import { Request, Response, NextFunction } from "express";
import { validateParameters } from "../utils/validateParameters";
import { sign } from "jsonwebtoken";

import { getUserByEmail, createUser } from "../services/user.service";
import { checkPassword, hashPassword } from "../utils/password";

import { logger } from "../utils/logger";

export async function register(
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    try {
        if (!validateParameters(_req, res)) {
            return;
        }

        const { email, password, name, surname, nickName, role, age } =
            _req.body;

        const user = await getUserByEmail(email);

        if (user) {
            throw new Error("User already registered");
        }

        const hash = await hashPassword(password);

        const createdUser = await createUser({
            email,
            password: hash,
            name,
            surname,
            nickName,
            role: role,
            age,
        });

        return res.json({
            data: [createdUser],
            message: "User registered successfully",
        });
    } catch (error) {
        logger.error(error);
        _next(error);
    }
}

export async function login(_req: Request, res: Response, _next: NextFunction) {
    try {
        if (!validateParameters(_req, res)) {
            return;
        }

        const { email, password } = _req.body;

        const user = await getUserByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        if (!(await checkPassword(password, user.password))) {
            throw new Error("Invalid password");
        }

        const token = sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || 86400,
            }
        );

        return res.json({
            data: { token },
            message: _req.__("login_success"),
        });
    } catch (error) {
        logger.error(error);
        _next(error);
    }
}
