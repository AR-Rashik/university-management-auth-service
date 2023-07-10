/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import config from "../../config";
import { IGenericErrorMessage } from "../../interfaces/error";
import handleValidationError from "../../errors/handleValidationError";
import { ZodError } from "zod";
import ApiError from "../../errors/ApiError";
import { errorLogger } from "../../shared/logger";
import handleZodError from "../../errors/handleZodError";
import { Error } from "mongoose";
import handleCastError from "../../errors/handleCastError";

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // In development the errors will be shown on the console, otherwise on the production it will be shown on the error logger.
  config.env === "development"
    ? console.log(`🚫 globalErrorHandler ~~`, error)
    : errorLogger.error(`🚫 globalErrorHandler ~~`, error);

  let statusCode = 500;
  let message = "Something went wrong !";
  let errorMessages: IGenericErrorMessage[] = [
    {
      path: req.originalUrl,
      message: error?.message,
    },
  ];

  // validation error
  if (error?.name === "ValidationError") {
    // res.status(200).json({ error });   // at first see the type of the error response then simplify it.
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }
  // zod error
  else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }
  // Mongoose cast error
  else if (error?.name === "CastError") {
    // res.status(200).json({ error });
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }
  // API error
  else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    // message = error.message;
    message = error?.name + "! " + error?.message;
    errorMessages = error?.message
      ? [
          {
            path: req.originalUrl,
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    // message = error?.message;
    message = error?.name;
    errorMessages = error?.message
      ? [
          {
            path: req.originalUrl,
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message,
    errorMessages,
    stack: config.env !== "production" ? error?.stack : undefined,
  });

  // next();
};

export default globalErrorHandler;
