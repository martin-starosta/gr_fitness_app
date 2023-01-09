import { Request, Response, NextFunction } from "express";
import { getPrograms } from "../services/program.services";

export async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const programs = await getPrograms();
        return res.json({
            data: programs,
            message: "List of programs",
        });
    } catch (err) {
        console.error(`Error while getting programming languages`, err.message);
        next(err);
    }
}
