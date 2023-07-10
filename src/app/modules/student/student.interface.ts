import { Model, Types } from "mongoose";
import { IAcademicDepartment } from "../academicDepartment/academicDepartment.interface";
import { IAcademicFaculty } from "../academicFaculty/academicFaculty.interface";
import { IAcademicSemester } from "../academicSemester/academicSemester.interface";
import { Gender } from "../../../constants/gender";
import { BloodGroup } from "../../../constants/bloodGroup";
import { UserName } from "../../../constants/userName";

// type Gender = "male" | "female" | "other";
// type BloodGroup =
//   | "A+"
//   | "A-"
//   | "B+"
//   | "B-"
//   | "AB+"
//   | "AB-"
//   | "O+"
//   | "O-"
//   | "Unknown";

// export type UserName = {
//   firstName: string;
//   middleName?: string;
//   lastName: string;
// };

export type Guardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
  address: string;
};

export type LocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type IStudent = {
  id: string;
  name: UserName; //embedded object
  // gender: 'male' | 'female';
  gender: Gender;
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  // bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  bloodGroup?: BloodGroup;
  presentAddress: string;
  permanentAddress: string;
  guardian: Guardian; // embedded object
  localGuardian: LocalGuardian; // embedded object
  academicFaculty: Types.ObjectId | IAcademicFaculty; // reference _id
  academicDepartment: Types.ObjectId | IAcademicDepartment; // reference _id
  academicSemester: Types.ObjectId | IAcademicSemester; // reference _id
  profileImage?: string;
};

export type StudentModel = Model<IStudent, Record<string, unknown>>;

export type IStudentFilters = {
  searchTerm?: string;
  id?: string;
  bloodGroup?: string;
  // bloodGroup?: BloodGroup;
  email?: string;
  contactNo?: string;
  emergencyContactNo?: string;
};
