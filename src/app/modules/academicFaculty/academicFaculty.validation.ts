import { z } from "zod";

// Title is required when create
const createFacultyZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
  }),
});

// Title is required when update
const updateFacultyZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
  }),
});

export const AcademicFacultyValidation = {
  createFacultyZodSchema,
  updateFacultyZodSchema,
};
