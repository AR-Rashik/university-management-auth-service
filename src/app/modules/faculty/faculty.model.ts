import { Schema, Types, model } from "mongoose";
import { FacultyModel, IFaculty } from "./faculty.interface";
import { bloodGroup } from "../../../enums/bloodGroup";
import { gender } from "../../../enums/gender";

const FacultySchema = new Schema<IFaculty, FacultyModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        middleName: {
          type: String,
          required: false,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      // enum: ["male", "female"],
      enum: gender,
    },
    bloodGroup: {
      type: String,
      // enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      enum: bloodGroup,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    contactNo: {
      type: String,
      unique: true,
      required: true,
    },
    emergencyContactNo: {
      type: String,
      required: true,
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    academicDepartment: {
      type: Types.ObjectId,
      ref: "AcademicDepartment",
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      // required: true,
    },
    academicFaculty: {
      type: Types.ObjectId,
      ref: "AcademicFaculty",
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

export const Faculty = model<IFaculty, FacultyModel>("Faculty", FacultySchema);
