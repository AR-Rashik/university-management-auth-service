import { Model, Types } from "mongoose";
import { IAcademicDepartment } from "../academicDepartment/academicDepartment.interface";
import { IAcademicFaculty } from "../academicFaculty/academicFaculty.interface";
import { BloodGroup } from "../../../constants/bloodGroup";
import { Gender } from "../../../constants/gender";
import { UserName } from "../../../constants/userName";

// export type UserName = {
//   firstName: string;
//   middleName: string;
//   lastName: string;
// };

export type IFaculty = {
  id: string;
  name: UserName;
  profileImage: string;
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  // gender?: 'male' | 'female';
  gender?: Gender;
  permanentAddress?: string;
  presentAddress?: string;
  // bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  bloodGroup?: BloodGroup;

  academicDepartment: Types.ObjectId | IAcademicDepartment;
  academicFaculty: Types.ObjectId | IAcademicFaculty;
  designation: string;
};

export type FacultyModel = Model<IFaculty, Record<string, unknown>>;

export type IFacultyFilters = {
  searchTerm?: string;
  id?: string;
  email?: string;
  contactNo?: string;
  emergencyContactNo?: string;
  // gender?: 'male' | 'female';
  gender?: Gender;
  // bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  bloodGroup?: BloodGroup;
  academicDepartment?: string;
  academicFaculty?: string;
  designation?: string;
};
