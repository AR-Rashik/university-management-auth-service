import { Model, Types } from "mongoose";
import { IManagementDepartment } from "../managementDepartment/managementDepartment.interface";
import { UserName } from "../../../constants/userName";
import { BloodGroup } from "../../../constants/bloodGroup";
import { Gender } from "../../../constants/gender";

// export type UserName = {
//   firstName: string;
//   lastName: string;
//   middleName: string;
// };

export type IAdmin = {
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

  managementDepartment: Types.ObjectId | IManagementDepartment;
  designation: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;

export type IAdminFilters = {
  searchTerm?: string;
  id?: string;
  email?: string;
  contactNo?: string;
  emergencyContactNo?: string;
  // gender?: "male" | "female";
  gender?: Gender;
  // bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  bloodGroup?: BloodGroup;
  managementDepartment?: string;
  designation?: string;
};
