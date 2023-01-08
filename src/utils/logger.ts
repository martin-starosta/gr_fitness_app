import { createLogger, transports, format } from "winston";
const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logConfiguration = {
    transports: [
        new transports.Console({
            level: "debug",
            format: combine(timestamp(), customFormat),
        }),
        new transports.File({
            level: "error",
            format: combine(timestamp(), customFormat),
            filename: "logs/error.log",
        }),
    ],
};

export const logger = createLogger(logConfiguration);
