import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
) {
    if (res.headersSent) {
        return next(err);
    }

    // Log error
    logger.error(err.message);

    res.status(500);
    res.send({
        data: {},
        message: res.__("defaultError"),
    });
}
