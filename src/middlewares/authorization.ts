import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { models } from "../db";
const { User } = models;

import { ROLE } from "../utils/enums";

interface JwtPayload {
    id: string;
}

export function verifyJWT(_req: Request, res: Response, next: NextFunction) {
    const authHeader = _req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
        return res.status(401).send({
            data: [],
            message: "You must be logged to access this route",
        });

    verify(
        token,
        process.env.JWT_SECRET,
        async function (err: Error, decoded: JwtPayload) {
            if (err)
                return res.status(500).send({
                    auth: false,
                    message: "Failed to authenticate token.",
                });

            const user = await User.findByPk(decoded.id);
            _req.body.userId = user.id;
            _req.body.userRole = user.role;

            next();
        }
    );
}

export function verifyRole(role: ROLE) {
    return function (_req: Request, res: Response, next: NextFunction) {
        verifyJWT(_req, res, async () => {
            const user = await User.findByPk(_req.body.userId);
            if (user.role !== role) {
                return res.status(401).send({
                    data: [],
                    message: "You don't have permission to access this route",
                });
            }
            next();
        });
    };
}
