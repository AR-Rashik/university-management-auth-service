import { z } from "zod";

// Create management department zod validation
const createManagementDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
  }),
});

// Update management department zod validation
const updateManagementDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
  }),
});

export const ManagementDepartmentValidation = {
  createManagementDepartmentZodSchema,
  updateManagementDepartmentZodSchema,
};
