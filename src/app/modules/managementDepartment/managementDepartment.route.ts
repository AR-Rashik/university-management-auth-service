import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ManagementDepartmentController } from "./managementDepartment.controller";
import { ManagementDepartmentValidation } from "./managementDepartment.validation";

const router = express.Router();

router.post(
  "/create-department", // create management department
  validateRequest(
    ManagementDepartmentValidation.createManagementDepartmentZodSchema
  ),
  ManagementDepartmentController.createDepartment
);

router.get("/:id", ManagementDepartmentController.getSingleDepartment); // get single management department

router.patch(
  "/:id", // update management department
  validateRequest(
    ManagementDepartmentValidation.updateManagementDepartmentZodSchema
  ),
  ManagementDepartmentController.updateDepartment
);

router.delete("/:id", ManagementDepartmentController.deleteDepartment); // delete management department

router.get("/", ManagementDepartmentController.getAllDepartments); // get all management departments

export const ManagementDepartmentRoutes = router;
