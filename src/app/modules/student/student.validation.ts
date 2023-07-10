import { z } from "zod";
import { gender } from "../../../enums/gender";
import { bloodGroup } from "../../../enums/bloodGroup";
// import { bloodGroup, gender } from "../student/student.constant";

const updateStudentZodSchema = z.object({
  body: z.object({
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        middleName: z.string().optional(),
      })
      .optional(),

    gender: z.enum([...gender] as [string, ...string[]]).optional(),

    dateOfBirth: z.string().optional(),

    email: z.string().email({ message: "Invalid email address" }).optional(),

    contactNo: z.string().optional(),

    emergencyContactNo: z.string().optional(),

    bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),

    presentAddress: z.string().optional(),

    permanentAddress: z.string().optional(),

    academicSemester: z.string().optional(),

    academicDepartment: z.string().optional(),

    academicFaculty: z.string().optional(),

    guardian: z
      .object({
        fatherName: z.string().optional(),
        fatherOccupation: z.string().optional(),
        fatherContactNo: z.string().optional(),
        motherName: z.string().optional(),
        motherOccupation: z.string().optional(),
        motherContactNo: z.string().optional(),
        address: z.string().optional(),
      })
      .optional(),

    localGuardian: z
      .object({
        name: z.string().optional(),
        occupation: z.string().optional(),
        contactNo: z.string().optional(),
        address: z.string().optional(),
      })
      .optional(),

    profileImage: z.string().optional(),
  }),
});

export const StudentValidation = {
  updateStudentZodSchema,
};
