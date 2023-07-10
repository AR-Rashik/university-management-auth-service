/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-dgetAllFacultiesisable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from "mongoose";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";

import httpStatus from "http-status";
import { User } from "../user/user.model";
import { facultySearchableFields } from "./faculty.constant";
import { IFaculty, IFacultyFilters } from "./faculty.interface";
import { Faculty } from "./faculty.model";
import ApiError from "../../../errors/ApiError";

// Get all faculties
const getAllFaculties = async (
  filters: IFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFaculty[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: facultySearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Faculty.find(whereConditions)
    .populate("academicDepartment")
    .populate("academicFaculty")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Faculty.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get single Faculty
const getSingleFaculty = async (id: string): Promise<IFaculty | null> => {
  // Check if faculty is exist with id
  const isExist = await Faculty.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Faculty not found!");
  }

  const result = await Faculty.findOne({ id })
    .populate("academicDepartment")
    .populate("academicFaculty");

  return result;
};

// Update faculty
const updateFaculty = async (
  id: string,
  payload: Partial<IFaculty>
): Promise<IFaculty | null> => {
  const isExist = await Faculty.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Faculty not found! ");
  }

  const { name, ...FacultyData } = payload;
  const updatedFacultyData: Partial<IFaculty> = { ...FacultyData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IFaculty>;
      (updatedFacultyData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Faculty.findOneAndUpdate({ id }, updatedFacultyData, {
    new: true,
  });
  return result;
};

// Delete faculty with user

const deleteFaculty = async (id: string): Promise<IFaculty | null> => {
  const session = await mongoose.startSession(); // start session on mongoose

  // Check if the id is correct for faculty.
  if (id) {
    const isCorrect = await Faculty.findOne({
      id,
    });
    if (!isCorrect) {
      throw new ApiError(httpStatus.NOT_FOUND, "Faculty not found!");
    }
  }

  // Check if the id is correct for user.
  if (id) {
    const isCorrect = await User.findOne({
      id,
    });
    if (!isCorrect) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
    }
  }

  try {
    session.startTransaction(); // start transaction

    // Delete document from User first
    const deletedUser = await User.findOneAndDelete({ id }, { session });

    if (deletedUser) {
      // Delete corresponding document from Student
      const result = await Faculty.findOneAndDelete({ id }, { session });

      await session.commitTransaction();
      await session.endSession();
      return result;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete faculty!");
    }
  } catch (error) {
    // Handle error and rollback the transaction

    await session.abortTransaction(); // abort transaction if any error happened then end session // rollback
    await session.endSession();
    throw error;
  }
};

export const FacultyService = {
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
