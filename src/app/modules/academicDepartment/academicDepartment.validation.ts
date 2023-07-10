import { z } from "zod";

// Create validation for title and faculty id
const createAcademicDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Department title is required",
    }),
    academicFaculty: z.string({
      required_error: "Academic Faculty id is required",
    }),
  }),
});

// Update validation of department
const updateAcademicDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    academicFaculty: z.string().optional(),
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentZodSchema,
  updateAcademicDepartmentZodSchema,
};
