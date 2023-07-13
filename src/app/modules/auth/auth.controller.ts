import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import config from "../../../config";
import { ILoginUserResponse, IRefreshTokenResponse } from "./auth.interface";

// Login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);

  const { refreshToken, ...others } = result;

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true, // only can accessible with http protocol in production level
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  //delete result.refreshToken    // not recommended

  if ("refreshToken" in result) {
    delete result.refreshToken;
  }

  sendResponse<ILoginUserResponse>(res, {
    // <ILoginUserResponse> is not mandatory
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: others, // send everything except the refresh token.
  });
});

// Refresh token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true, // only can accessible with http protocol in production level
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    // <IRefreshTokenResponse> is not mandatory
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully !",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
};
