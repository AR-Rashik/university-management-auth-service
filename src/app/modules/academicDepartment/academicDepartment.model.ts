import { Schema, model } from "mongoose";
import {
  AcademicDepartmentModel,
  IAcademicDepartment,
} from "./academicDepartment.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const AcademicDepartmentSchema = new Schema<
  IAcademicDepartment,
  AcademicDepartmentModel
>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId, // object id of existing mongodb id.
      ref: "AcademicFaculty", // to reference the academic faculty with department.
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// find if the academic department is exist or not?
AcademicDepartmentSchema.pre("save", async function (next) {
  const isExist = await AcademicDepartment.findOne({
    title: this.title,
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Academic Department is already exist!"
    );
  }
  next();
});

export const AcademicDepartment = model<
  IAcademicDepartment,
  AcademicDepartmentModel
>("AcademicDepartment", AcademicDepartmentSchema);
