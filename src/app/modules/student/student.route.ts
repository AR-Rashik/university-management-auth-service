import express from "express";
import { StudentController } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidation } from "./student.validation";

const router = express.Router();

router.get("/:id", StudentController.getSingleStudent); // get single student

router.get("/", StudentController.getAllStudents); // get all students

router.delete("/:id", StudentController.deleteStudent); // delete student

router.patch(
  "/:id",
  validateRequest(StudentValidation.updateStudentZodSchema), // update student
  StudentController.updateStudent
);

export const StudentRoutes = router;
