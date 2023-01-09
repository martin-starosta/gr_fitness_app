import { Router } from "express";
import { body } from "express-validator";

import { ROLE } from "../utils/enums";
import { validateEnumValue } from "../utils/validate";
import { register, login } from "../controllers/auth.controller";

const router: Router = Router();

export default () => {
    router.put(
        "/signup",
        body("email").isEmail(),
        body("password").isLength({ min: 1 }),
        body("age").optional().isInt(),
        body("role")
            .optional()
            .custom((value) => {
                validateEnumValue(value, ROLE, "role");
            }),
        register
    );

    router.post(
        "/login",
        body("email").isEmail(),
        body("password").isLength({ min: 1 }),
        login
    );

    return router;
};
