import { Schema, model } from "mongoose";
import {
  IAcademicFaculty,
  AcademicFacultyModel,
} from "./academicFaculty.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const AcademicFacultySchema = new Schema<
  IAcademicFaculty,
  AcademicFacultyModel
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
      virtuals: true, // this gives the id value on db when get.
    },
  }
);

// find if the academic faculty is exist or not?
AcademicFacultySchema.pre("save", async function (next) {
  const isExist = await AcademicFaculty.findOne({
    title: this.title,
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Academic faculty is already exist!"
    );
  }
  next();
});

export const AcademicFaculty = model<IAcademicFaculty, AcademicFacultyModel>(
  "AcademicFaculty",
  AcademicFacultySchema
);
