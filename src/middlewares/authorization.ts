import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

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
        function (err: Error, decoded: JwtPayload) {
            if (err)
                return res.status(500).send({
                    auth: false,
                    message: "Failed to authenticate token.",
                });

            _req.body.userId = decoded.id;

            next();
        }
    );
}
