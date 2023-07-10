/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from "mongoose";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";

import httpStatus from "http-status";
import { studentSearchableFields } from "./student.constant";
import { IStudent, IStudentFilters } from "./student.interface";
import { Student } from "./student.model";
import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";

// Get all students
const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IStudent[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: studentSearchableFields.map(field => ({
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

  const result = await Student.find(whereConditions)
    .populate("academicSemester")
    .populate("academicDepartment")
    .populate("academicFaculty")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Student.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get single student
const getSingleStudent = async (id: string): Promise<IStudent | null> => {
  const result = await Student.findOne({ id })
    .populate("academicSemester")
    .populate("academicDepartment")
    .populate("academicFaculty");
  return result;
};

// Update student
const updateStudent = async (
  id: string,
  payload: Partial<IStudent>
): Promise<IStudent | null> => {
  // student exist or not?
  const isExist = await Student.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found!");
  }

  // we have to destructure the embedded field such as name, guardian, localGuardian etc.
  const { name, guardian, localGuardian, ...studentData } = payload;

  const updatedStudentData: Partial<IStudent> = { ...studentData }; // copy of student data

  /* const name ={
    firstName: 'Mezba',  <----- update korar jnno
    middleName:'Abedin',
    lastName: 'Forhan'
  }
*/

  // dynamically handling if one data is updated and another is not on embedded object

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IStudent>; // `name.fisrtName`
      (updatedStudentData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  if (guardian && Object.keys(guardian).length > 0) {
    Object.keys(guardian).forEach(key => {
      const guardianKey = `guardian.${key}` as keyof Partial<IStudent>; // `guardian.firstGuardian`
      (updatedStudentData as any)[guardianKey] =
        guardian[key as keyof typeof guardian]; // updatedStudentData['guardian.motherContactNo']=guardian[motherContactNo]
      // updatedStudentData --> object create --> guardian : { motherContactNo: 0177}
    });
  }

  if (localGuardian && Object.keys(localGuardian).length > 0) {
    Object.keys(localGuardian).forEach(key => {
      const localGuardianKey =
        `localGuardian.${key}` as keyof Partial<IStudent>; // `localGuardian.firstName`
      (updatedStudentData as any)[localGuardianKey] =
        localGuardian[key as keyof typeof localGuardian];
    });
  }

  const result = await Student.findOneAndUpdate({ id }, updatedStudentData, {
    // it should be id cause it is updated via custom id not mongodb _id. // id: id -> id
    new: true,
  });
  return result;
};

// Delete student
const deleteStudent = async (id: string): Promise<IStudent | null> => {
  const session = await mongoose.startSession(); // start session on mongoose

  // Check if the id is correct for student.
  if (id) {
    const isCorrect = await Student.findOne({
      id,
    });
    if (!isCorrect) {
      throw new ApiError(httpStatus.NOT_FOUND, "Student not found!");
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
      const result = await Student.findOneAndDelete({ id }, { session })
        .populate("academicSemester")
        .populate("academicDepartment")
        .populate("academicFaculty");

      await session.commitTransaction();
      await session.endSession();
      return result;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete student!");
    }
  } catch (error) {
    // Handle error and rollback the transaction

    await session.abortTransaction(); // abort transaction if any error happened then end session // rollback
    await session.endSession();
    throw error;
  }
};

export const StudentService = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
