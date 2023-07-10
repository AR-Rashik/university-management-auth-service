import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentController } from "./academicDepartment.controller";
import { AcademicDepartmentValidation } from "./academicDepartment.validation";

const router = express.Router();

router.post(
  "/create-department",
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentZodSchema // create department
  ),
  AcademicDepartmentController.createDepartment
);

router.get("/:id", AcademicDepartmentController.getSingleDepartment); // get single department

router.patch(
  "/:id",
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentZodSchema // update department
  ),
  AcademicDepartmentController.updateDepartment
);

router.delete("/:id", AcademicDepartmentController.deleteDepartment); // delete department

router.get("/", AcademicDepartmentController.getAllDepartments); // get all departments

export const AcademicDepartmentRoutes = router;
