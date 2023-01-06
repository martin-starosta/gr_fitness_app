import { Request, Response } from "express";
import { validationResult } from "express-validator";

export function validateParameters(_req: Request, res: Response): boolean {
    const errors = validationResult(_req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            data: errors.array(),
            message: "Invalid parameters",
        });

        return false;
    }

    return true;
}
