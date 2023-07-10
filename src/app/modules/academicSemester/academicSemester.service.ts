import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import {
  academicSemesterSearchableFields,
  academicSemesterTitleCodeMapper,
} from "./academicSemester.constant";
import {
  IAcademicSemester,
  IAcademicSemesterFilters,
} from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";

// Create semester
const createSemester = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester> => {
  // Check the semester with it's specific code. like Autumn === 01
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Semester Code");
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

// Get all semesters
const getAllSemesters = async (
  filters: IAcademicSemesterFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAcademicSemester[]>> => {
  // const { page = 1, limit = 10 } = paginationOptions;
  // const skip = (page - 1) * limit; // pagination formula

  // search term
  const { searchTerm, ...filtersData } = filters;

  // Search on fields. partial match
  // const adConditions = [
  //   {
  //     $or: [
  //       {
  //         title: {
  //           $regex: searchTerm,
  //           $options: "i",
  //         },
  //       },
  //       {
  //         code: {
  //           $regex: searchTerm,
  //           $options: "i",
  //         },
  //       },
  //       {
  //         year: {
  //           $regex: searchTerm,
  //           $options: "i",
  //         },
  //       },
  //     ],
  //   },
  // ];

  const andConditions = [];

  // search term
  if (searchTerm) {
    // map on fields items that are searchable
    andConditions.push({
      $or: academicSemesterSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: "i", // this line of code is for case insensitive search term
        },
      })),
    });
  }

  // filters
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Get pagination options value.
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Sort conditions and functionality.
  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // Condition for empty searching, filtering or pagination route that fives all data.
  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // query should placed on Model
  const result = await AcademicSemester.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await AcademicSemester.countDocuments(whereCondition); // counts the number of documents that match filter.

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get single semester
const getSingleSemester = async (
  id: string
): Promise<IAcademicSemester | null> => {
  const result = await AcademicSemester.findById(id);

  return result;
};

// Update semester
const updateSemester = async (
  id: string,
  payload: Partial<IAcademicSemester> // partially give some value.
): Promise<IAcademicSemester | null> => {
  // Check the semester with it's specific code. like Autumn === 01
  if (
    payload.title &&
    payload.code &&
    academicSemesterTitleCodeMapper[payload.title] !== payload.code
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Semester Code");
  }
  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true, // for {new: true} the updated value is shown on the response
  });

  return result;
};

// Delete semester
const deleteSemester = async (
  id: string
): Promise<IAcademicSemester | null> => {
  const result = await AcademicSemester.findByIdAndDelete(id);

  return result;
};

export const AcademicSemesterService = {
  createSemester,
  getAllSemesters,
  getSingleSemester,
  updateSemester,
  deleteSemester,
};
