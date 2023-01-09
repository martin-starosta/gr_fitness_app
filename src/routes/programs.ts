import { Router } from "express";
const router: Router = Router();

import { list } from "../controllers/program.controller";

export default () => {
    router.get("/", list);
    return router;
};
