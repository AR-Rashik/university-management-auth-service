import { Request, RequestHandler, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IUser } from "./user.interface";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { paginationFields } from "../../../constants/pagination";

// Get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await UserService.getAllUsers(filters, paginationOptions);

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Faculties retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// Create student as user
const createStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { student, ...userData } = req.body;
    const result = await UserService.createStudent(student, userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `User - (${userData?.role}) created successfully`,
      data: result,
    });
    // next();

    // res.status(200).json({
    //   success: true,
    //   statusCode: 200,
    //   message: "User created successfully",
    //   data: result,
    // });
  }
);

// Create faculty as user
const createFaculty: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { faculty, ...userData } = req.body;
    const result = await UserService.createFaculty(faculty, userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `User - (${userData?.role}) created successfully`,
      data: result,
    });
  }
);

// Create admin as user
const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { admin, ...userData } = req.body;
    const result = await UserService.createAdmin(admin, userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `User - (${userData?.role}) created successfully`,
      data: result,
    });
  }
);

// old concept
// const createUser: RequestHandler = async (req, res, next) => {
//   try {
//     const { user } = req.body;
//     const result = await UserService.createUser(user);
//     res.status(200).json({
//       success: true,
//       statusCode: 200,
//       message: "User created successfully",
//       data: result,
//     });
//   } catch (error) {
//     // res.status(400).json({
//     //   success: false,
//     //   message: "Failed to create user",
//     // });
//     next(error);
//   }
// };

export const UserController = {
  getAllUsers,
  createStudent,
  createFaculty,
  createAdmin,
};
