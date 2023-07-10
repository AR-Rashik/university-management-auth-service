import { Request, RequestHandler, Response } from "express";
import { AcademicSemesterService } from "./academicSemester.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IAcademicSemester } from "./academicSemester.interface";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { academicSemesterFilterableFields } from "./academicSemester.constant";

// Create semester controller
// old concept
// const createSemester: RequestHandler = async (req, res, next) => {
//   try {
//     const { ...academicSemesterData } = req.body;
//     const result = await AcademicSemesterService.createSemester(
//       academicSemesterData
//     );
//     res.status(200).json({
//       success: true,
//       statusCode: 200,
//       message: "Academic semester is created successfully",
//       data: result,
//       // responseMessage: "Connection Successful",
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const createSemester: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...academicSemesterData } = req.body;
    const result = await AcademicSemesterService.createSemester(
      academicSemesterData
    );

    sendResponse<IAcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Academic semester created successfully!",
      data: result,
    });
    // next();

    // res.status(200).json({
    //   success: true,
    //   statusCode: 200,
    //   message: "Academic semester is created successfully",
    //   data: result,
    // });
  }
);

// Get all semesters
const getAllSemesters = catchAsync(async (req: Request, res: Response) => {
  // Searching and Filtering
  const filters = pick(req.query, academicSemesterFilterableFields);

  // const paginationOptions = {
  //   page: Number(req.query.page),
  //   limit: Number(req.query.limit),
  //   sortBy: req.query.sortBy,
  //   sortOrder: req.query.sortOrder,
  // };

  // pagination options
  const paginationOptions = pick(req.query, paginationFields);

  // console.log(paginationOptions);  // { page: '1', limit: '10' }

  const result = await AcademicSemesterService.getAllSemesters(
    filters,
    paginationOptions
  );

  sendResponse<IAcademicSemester[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semesters retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
  // next();
});

// Get single semester
const getSingleSemester = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AcademicSemesterService.getSingleSemester(id);

  sendResponse<IAcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester retrieved successfully",
    data: result,
  });
  // next();
});

// Update semester
const updateSemester = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await AcademicSemesterService.updateSemester(id, updatedData);

  sendResponse<IAcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester updated successfully",
    data: result,
  });
  // next();
});

// Delete semester
const deleteSemester = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AcademicSemesterService.deleteSemester(id);

  sendResponse<IAcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester deleted successfully",
    data: result,
  });
  // next();
});

export const AcademicSemesterController = {
  createSemester,
  getAllSemesters,
  getSingleSemester,
  updateSemester,
  deleteSemester,
};
