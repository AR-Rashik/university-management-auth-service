import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyController } from "./faculty.controller";
import { FacultyValidation } from "./faculty.validation";

const router = express.Router();

router.get("/:id", FacultyController.getSingleFaculty); // get single faculty

router.get("/", FacultyController.getAllFaculties); // get all faculties

router.patch(
  "/:id",
  validateRequest(FacultyValidation.updateFacultyZodSchema), // update faculty
  FacultyController.updateFaculty
);

router.delete("/:id", FacultyController.deleteFaculty); // delete faculty

export const FacultyRoutes = router;
