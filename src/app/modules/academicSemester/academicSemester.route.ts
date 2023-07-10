import express from "express";
import validateRequest from "../../middlewares/validateRequest";
// import { UserController } from './user.controller';

// import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from "./academicSemester.validation";
import { AcademicSemesterController } from "./academicSemester.controller";
const router = express.Router();

router.post(
  "/create-semester",
  validateRequest(AcademicSemesterValidation.createAcademicSemesterZodSchema), // create academic semester
  AcademicSemesterController.createSemester
);

router.get("/:id", AcademicSemesterController.getSingleSemester); // get academic semester by id

router.patch(
  "/:id",
  validateRequest(AcademicSemesterValidation.updateAcademicSemesterZodSchema),
  AcademicSemesterController.updateSemester
); // update semester

router.delete("/:id", AcademicSemesterController.deleteSemester); // delete semester

router.get("/", AcademicSemesterController.getAllSemesters); // get all academic semester including pagination and filter

export const AcademicSemesterRoutes = router;
