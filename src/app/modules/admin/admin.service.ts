/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose, { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { User } from "../user/user.model";
import { adminSearchableFields } from "./admin.constant";
import { IAdmin, IAdminFilters } from "./admin.interface";
import { Admin } from "./admin.model";

// Get all admins
const getAllAdmins = async (
  filters: IAdminFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAdmin[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: adminSearchableFields.map(field => ({
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

  const result = await Admin.find(whereConditions)
    .populate("managementDepartment")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Admin.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get single admin
const getSingleAdmin = async (id: string): Promise<IAdmin | null> => {
  // Check if faculty is exist with id
  const isExist = await Admin.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found!");
  }

  const result = await Admin.findOne({ id }).populate("managementDepartment");
  return result;
};

// Update admin
const updateAdmin = async (
  id: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  // Check admin is exist
  const isExist = await Admin.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found!");
  }

  const { name, ...adminData } = payload;

  const updatedAdminData: Partial<IAdmin> = { ...adminData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>;
      (updatedAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Admin.findOneAndUpdate({ id }, updatedAdminData, {
    new: true,
  });
  return result;
};

// Delete admin as user
const deleteAdmin = async (id: string): Promise<IAdmin | null> => {
  const session = await mongoose.startSession(); // start session on mongoose

  // Check if the id is correct for admin.
  if (id) {
    const isCorrect = await Admin.findOne({
      id,
    });
    if (!isCorrect) {
      throw new ApiError(httpStatus.NOT_FOUND, "Admin not found!");
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
      const result = await Admin.findOneAndDelete({ id }, { session });

      await session.commitTransaction();
      await session.endSession();
      return result;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete admin!");
    }
  } catch (error) {
    // Handle error and rollback the transaction

    await session.abortTransaction(); // abort transaction if any error happened then end session // rollback
    await session.endSession();
    throw error;
  }
};

export const AdminService = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
