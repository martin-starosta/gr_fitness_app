import http from "http";
import express from "express";
import * as bodyParser from "body-parser";

import { sequelize } from "./db";
import ProgramRouter from "./routes/programs";
import ExerciseRouter from "./routes/exercises";
import AuthRouter from "./routes/auth";
import UserRouter from "./routes/users";

import i18n from "./config/localization";

import "express-async-errors";
import { errorHandler } from "./middlewares/error.middleware";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(i18n.init);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/programs", ProgramRouter());
app.use("/exercises", ExerciseRouter());
app.use("/auth", AuthRouter());
app.use("/users", UserRouter());
app.use(errorHandler);

const httpServer = http.createServer(app);

sequelize.sync();

console.log("Sync database", "postgresql://localhost:5432/fitness_app");

httpServer
    .listen(8000)
    .on("listening", () => console.log(`Server started at port ${8000}`));

export default httpServer;
