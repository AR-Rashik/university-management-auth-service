import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyController } from "./academicFaculty.controller";
import { AcademicFacultyValidation } from "./academicFaculty.validation";

const router = express.Router();

router.post(
  "/create-faculty",
  validateRequest(AcademicFacultyValidation.createFacultyZodSchema), // create faculty
  AcademicFacultyController.createFaculty
);

router.get("/:id", AcademicFacultyController.getSingleFaculty); // Get single faculty by id

router.patch(
  "/:id",
  validateRequest(AcademicFacultyValidation.updateFacultyZodSchema), // Update faculty
  AcademicFacultyController.updateFaculty
);

router.delete("/:id", AcademicFacultyController.deleteFaculty); // Delete faculty

router.get("/", AcademicFacultyController.getAllFaculties); // Get all faculties

export const AcademicFacultyRoutes = router;
