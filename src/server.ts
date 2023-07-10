/* eslint-disable no-console */
import mongoose from "mongoose";
import app from "./app";
import config from "./config/index";
import { errorLogger, logger } from "./shared/logger";
import { Server } from "http";

// Handle uncaught exception
process.on("uncaughtException", error => {
  errorLogger.error(error);
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    // console.log("👌 Database is connected successfully");
    logger.info("👌 Database is connected successfully");

    server = app.listen(config.port, () => {
      // console.log(`Application listening on port ${config.port}`);
      logger.info(`Application listening on port ${config.port}`);
    });
  } catch (error) {
    // console.log("👎 Failed to connect database");
    errorLogger.error("👎 Failed to connect database", error);
  }

  // close the server gracefully for unhandled rejection request
  process.on("unhandledRejection", error => {
    // console.log(
    //   "Unhandled rejection is detected, we are closing our server........."
    // );

    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

// Handle Signal Termination (SIGTERM)
process.on("SIGTERM", () => {
  logger.info("SIGTERM is received");
  if (server) {
    server.close();
  }
});
