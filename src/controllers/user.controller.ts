import { Request, Response, NextFunction } from "express";
import { getUsers, getUser, updateUser } from "../services/user.service";
import { ROLE } from "../utils/enums";
import { UserRequestParams } from "../types";
import { validateParameters } from "../utils/validateParameters";

import { logger } from "../utils/logger";

export async function list(_req: Request, res: Response, _next: NextFunction) {
    try {
        const { userRole } = _req.body;
        const users = await getUsers(userRole);

        return res.json({
            data: users,
            message: "List of users",
        });
    } catch (error) {
        logger.error("Not able to retrieve users list");
        _next(error);
    }
}

export async function get(_req: Request, res: Response, _next: NextFunction) {
    try {
        const { id } = _req.params;
        const { userRole, userId }: Partial<UserRequestParams> = _req.body;

        if (userRole !== ROLE.ADMIN && userId !== id) {
            return res.status(401).send({
                data: [],
                message: "You don't have permission to access this route",
            });
        }

        return res.json({
            data: await getUser(id),
            message: "User details",
        });
    } catch (error) {
        logger.error("Not able to retrieve user details");
        _next(error);
    }
}

export async function update(_req: Request, res: Response) {
    if (!validateParameters(_req, res)) {
        return;
    }
    const { id } = _req.params;
    const { name, surname, nickName, role, age }: Partial<UserRequestParams> =
        _req.body;

    const user = await updateUser(
        parseInt(id),
        name,
        surname,
        nickName,
        role,
        age
    );

    return res.json({
        data: user,
        message: "User updated",
    });
}
