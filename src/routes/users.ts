import { Router } from "express";
import { body } from "express-validator";
import { verifyJWT, verifyRole } from "../middlewares/authorization.middleware";

const router: Router = Router();
import { ROLE } from "../utils/enums";

import { list, get, update } from "../controllers/user.controller";

export default () => {
    router.get("/", verifyJWT, list);

    router.get("/:id", verifyJWT, get);

    router.post(
        "/:id",
        body("age").optional().isInt(),
        verifyRole(ROLE.ADMIN),
        update
    );

    return router;
};
