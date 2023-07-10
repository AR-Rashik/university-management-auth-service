import mongoose from "mongoose";
import { IGenericErrorMessage } from "../interfaces/error";

const handleCastError = (error: mongoose.Error.CastError) => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error?.path,
      message: `Invalid ${error?.kind} for ${error?.kind} = ${error?.value}`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: `Cast Error! Invalid ${error?.kind}`,
    errorMessages: errors,
  };
};

export default handleCastError;
