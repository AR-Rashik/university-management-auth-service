import { z } from "zod";
import { gender } from "../../../enums/gender";
import { bloodGroup } from "../../../enums/bloodGroup";

const updateAdmin = z.object({
  body: z.object({
    name: z
      .object({
        firstName: z.string().optional(),
        middleName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),

    dateOfBirth: z.string().optional(),

    // gender: z.string().optional(),
    gender: z.enum([...gender] as [string, ...string[]]).optional(),

    // bloodGroup: z.string().optional(),
    bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),

    email: z.string().email({ message: "Invalid email address" }).optional(),

    contactNo: z.string().optional(),

    emergencyContactNo: z.string().optional(),

    presentAddress: z.string().optional(),

    permanentAddress: z.string().optional(),

    department: z.string().optional(),

    designation: z.string().optional(),

    profileImage: z.string().optional(),
  }),
});

export const AdminValidation = {
  updateAdmin,
};
