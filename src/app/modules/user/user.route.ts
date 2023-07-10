import express from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/create-student", // create student as user
  validateRequest(UserValidation.createStudentZodSchema),
  UserController.createStudent
);

router.post(
  "/create-faculty", // create faculty as user
  validateRequest(UserValidation.createFacultyZodSchema),
  UserController.createFaculty
);

router.post(
  "/create-admin", // create admin as user
  validateRequest(UserValidation.createAdminZodSchema),
  UserController.createAdmin
);

router.get("/", UserController.getAllUsers); // Get all faculties

export const UserRoutes = router;
