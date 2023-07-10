import { Schema, model } from "mongoose";
import {
  IManagementDepartment,
  ManagementDepartmentModel,
} from "./managementDepartment.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const ManagementDepartmentSchema = new Schema<
  IManagementDepartment,
  ManagementDepartmentModel
>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// find if the academic faculty is exist or not?
ManagementDepartmentSchema.pre("save", async function (next) {
  const isExist = await ManagementDepartment.findOne({
    title: this.title,
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Management Department is already exist!"
    );
  }
  next();
});

export const ManagementDepartment = model<
  IManagementDepartment,
  ManagementDepartmentModel
>("ManagementDepartment", ManagementDepartmentSchema);
