/* eslint-disable no-undef */
// import winston from "winston";
import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format; // for formatting
import DailyRotateFile from "winston-daily-rotate-file";

import path from "path";

//- Custom Log Format
const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // return ` ${timestamp}, [${label}] ${level}: ${message},`;
  return `${date.toDateString()} ${hour}:${minutes}:${seconds} - [${label}] ${level}: ${message},`;
});

// For info logger
const logger = createLogger({
  level: "info",
  format: combine(
    label({ label: "PH-UMAS" }),
    timestamp(),
    myFormat
    // prettyPrint()
  ),
  transports: [
    new transports.Console(),
    // new transports.File({    // not needed for daily-rotate-file
    //   filename: path.join(process.cwd(), "logs", "winston", "success.log"),
    //   level: "info",
    // }),
    new DailyRotateFile({
      // for daily-rotate-file
      filename: path.join(
        process.cwd(),
        "logs",
        "winston",
        "successes",
        "PH-UMAS-%DATE%-success.log"
      ),
      datePattern: "YYYY-DD-MM-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

// For error logger
const errorLogger = createLogger({
  level: "error",
  format: combine(label({ label: "PH-UMAS" }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    // new transports.File({  // not needed for daily-rotate-file
    //   filename: path.join(process.cwd(), "logs", "winston", "error.log"),
    //   level: "error",
    // }),
    new DailyRotateFile({
      // for daily-rotate-file
      filename: path.join(
        process.cwd(),
        "logs",
        "winston",
        "errors",
        "PH-UMAS-%DATE%-error.log"
      ),
      datePattern: "YYYY-DD-MM-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export { logger, errorLogger };

// const logger = winston.createLogger({
//   level: "info",
//   format: winston.format.json(),
//   transports: [
//     //
//     // - Write all logs with importance level of `error` or less to `error.log`
//     // - Write all logs with importance level of `info` or less to `combined.log`
//     //

//     new winston.transports.Console(),
//     new winston.transports.File({ filename: "error.log", level: "error" }),
//     new winston.transports.File({ filename: "combined.log" }),
//   ],
// });

// export default logger;
