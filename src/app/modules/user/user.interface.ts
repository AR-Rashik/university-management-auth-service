/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { IStudent } from "../student/student.interface";
import { IFaculty } from "../faculty/faculty.interface";
import { IAdmin } from "../admin/admin.interface";

export type IUser = {
  id: string;
  role: string;
  password: string;
  needsPasswordChange: true | false;
  student?: Types.ObjectId | IStudent;
  faculty?: Types.ObjectId | IFaculty;
  admin?: Types.ObjectId | IAdmin;
};

// instance method
// export type IUserMethods = {
//   isUserExist(id: string): Promise<Partial<IUser | null>>;
//   isPasswordMatched(
//     givenPassword: string,
//     savedPassword: string
//   ): Promise<boolean>;
// };

// export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

// static  // optional
export type UserModel = {
  isUserExist(
    id: string
  ): Promise<Pick<IUser, "id" | "password" | "role" | "needsPasswordChange">>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

export type IUserFilters = {
  searchTerm?: string;
  id?: string;
  role?: string;
  password?: string;
};
